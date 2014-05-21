var elastical = require('elastical'),
    async = require('async'),
    _ = require('lodash'),
    config = require('../../config/app.json');


var client = new elastical.Client(config.elasticsearch.host, {
      port: config.elasticsearch.port
    }),
    defaultIndex = config.elasticsearch.index,
    companyType = 'company';


/**
 * Mongoose plugin for automatically indexing
 * (also adds search method)
 * 
 * @return {void} [description]
 */
module.exports.plugin = function(schema, options) {

  schema.post('remove', function() {
    module.exports.delete(this._id);
  });

  schema.post('save', function() {
    var company = this;
    module.exports.index(this._id, function(err, res) {
      company.emit('es-indexed', err, res);
    });
  });

  _.extend(schema.methods, {
    index: module.exports.index,
    delete: module.exports.delete
  });

  _.extend(schema.statics, {
    search: module.exports.search,
    createMapping: module.exports.createMapping
  });
};



/**
 * Hydrate search results
 *
 * @param {array} raw search results
 * @param {func}  callback
 * @return {void}
 */
var hydrate = function(results, options, done) {

  if (!_.isObject(options)) {
    done = options;
  }

  var ids = _.compact(_.map(results.hits, function(hit) {
        if (hit.fields) {
          return hit.fields._id;
        }
      })),
      indexes = {},
      query;

  // Record the index of each of the results
  _.each(ids, function(id, index) {
    indexes[id] = index;
  });

  query = require('../../models/company').find({
    _id: {
      $in: ids
    }
  });

  buildQuery(query, options);

  query.exec(function(err, docs){
    if ( err || ! docs ) {
      return done(err);
    }

    var hits = results.hits;

    _.each(docs, function(doc) {
      var i = indexes[doc._id]
      hits[i] = doc
    });

    results.hits = hits;
    done(null, results);
  });

};


/**
 * Build a mongoose query from an object
 *
 * @param  {object}  mongoose query in an object form
 * @param  {object}  methods to call on the query
 * @return {void}
 */
var buildQuery = function(query, options) {
  _.forIn(options, function(value, key) {
    query[key](value);
  });
};


/**
 * Search companies
 *
 * @param {object} search query
 * @param {object} options (for the mongoose query)
 * @param {func}   callback
 * @return {void}
 */
module.exports.search = function(query, options, done) {
  query.fields = '_id';
  query.index = defaultIndex;
  query.type = companyType;

  client.search(query, function(err, results, res){
    if ( err ) {
      return done(err);
    }

    hydrate(results, options, done);
  });
};



/**
 * Create mapping for the company index
 * 
 * @param  {func}   callback
 * @return {void}
 */
module.exports.createMapping = function(done) {

};


/**
 * Index a company in elastic search
 * 
 * @param  {string}   companyId
 * @param  {func}     done
 * @return {void}
 */
module.exports.index = function(companyId, done) {

  async.waterfall([

    /**
     * Get the company
     */
    function(callback) {
      // Require the company service here to make sure the model is already loaded
      require('../company').findById(companyId._id || companyId, function(err, company) {
        if (err || ! company) {
          return callback(new Error("Unable to index company: the company could not be found."));
        }

        callback(null, company);
      });
    },

    function(company, callback) {

      company = company.toJSON();

      // Get the lat lng of the company
      if ( company.address && company.address.lat && company.address.lng ) {
        company.location = company.address.lat + ',' + company.address.lng;
      }

      // Make sure the mongoose _id is a string
      company._id = company._id.toString();

      // Delete stuff we dont need
      delete company._acl;
      delete company.logo;
      delete company.logoUrl;
      delete company.url;

      client.index(defaultIndex, companyType, company, {
        id: company._id.toString(),
        refresh: true,
        // create: true
      }, function(err, res) {
        if (err) {
          return callback(err);
        }
        callback(null, res);
      });
    }

  ], done || function(){});

};


/**
 * Delete a company from the elastic search index
 *
 * @param {string} companyId 
 * @param {func}   callback 
 * @return {void}
 */
module.exports.delete = function(companyId, done) {
  client.delete(defaultIndex, companyType, companyId, {}, done);
};





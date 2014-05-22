var _ = require('lodash'),
    async = require('async'),
    Helpers = require('../helpers'),
    Builder = require('./queryBuilder');


/**
 * Convert search object into a elasticsearch query
 */
var buildSearchQuery = function(input) {

  var from = (input.page && input.page > 1) ? (input.page-1) * defaultSize : 0;

  var query = new Builder.Search()
    .size(input.perPage || 50)
    .from(from)
    .fields('_id')
    .query(new Builder.StringQuery(input.query))
    .filter(new Builder.AndQuery(
      new Builder.OrQuery(
        new Builder.TermQuery('address.city', Helpers.parseList(input.locations)),
        new Builder.TermQuery('address.state', Helpers.parseList(input.locations))
      ),
      new Builder.TermQuery('skills', Helpers.parseList(input.skills))
    ));


    // console.log(JSON.stringify(query.toJSON(), true, '    '));

  return query.toJSON();
};


var buildRecommendationQuery = function(input) {

  var query = new Builder.Search()
    .size(5)
    .from(0)
    .fields('_id')
    .query(new Builder.StringQuery(input.query))
    .filter(new Builder.GeoQuery('location', input.lat, input.lng, "25km"));
    
    // console.log(JSON.stringify(query.toJSON(), true, '    '));

  return query.toJSON();
};


module.exports = {
  search: buildSearchQuery,
  recommend: buildRecommendationQuery
}
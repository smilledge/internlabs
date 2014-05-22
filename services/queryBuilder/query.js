var _ = require('lodash');

/**
 * String query
 */
var StringQuery = function(string) {
  this.string = string;
}

StringQuery.prototype.toJSON = function() {
  if (!this.string || !this.string.length) {
    return null;
  }

  var object = {};
  object.query_string = {};
  object.query_string.query = this.string.toLowerCase();
  return object;
};



/**
 * Term query
 */
var TermQuery = function(field, value, min) {
  this.field = field;
  this.value = value;

  if (_.isArray(value)) {
    this.multi = true;
  }
}

TermQuery.prototype.toJSON = function() {
  if (!this.value || !_.compact(this.value).length) {
    return null;
  }

  var object = {};

  if (this.multi) {
    object.terms = {};
    object.terms[this.field] = this.value
  } else {
    object.term = {};
    object.term[this.field] = this.value;
  }

  return object;
};



/**
 * And query
 */
var AndQuery = function() {
  this.queries = _.compact(_.map(Array.prototype.slice.call(arguments, 0), function(query) {
    return query.toJSON();
  }));
}

AndQuery.prototype.toJSON = function() {
  if (!this.queries.length) {
    return null;
  }

  if (this.queries.length === 1) {
    return this.queries;
  }

  var object = {};
  object.and = this.queries;
  return object;
};



/**
 * Or query
 */
var OrQuery = function() {
  this.queries = _.compact(_.map(Array.prototype.slice.call(arguments, 0), function(query) {
    return query.toJSON();
  }));
}

OrQuery.prototype.toJSON = function() {
  if (!this.queries.length) {
    return null;
  }

  if (this.queries.length === 1) {
    return this.queries;
  }

  var object = {};
  object.or = this.queries;
  return object;
};



/**
 * Range query
 */
var RangeQuery = function(field, from, to) {
  this.field = field;
  this.from = from;
  this.to = to;
}

RangeQuery.prototype.toJSON = function() {
  var object = {};
  object.range = {};
  object.range[this.field] = {
    from: this.from,
    to: this.to
  };
  return object;
};



/**
 * Geo Distance query
 */
var GeoQuery = function(field, lat, lng, distance) {
  this.field = field;
  this.lat = lat;
  this.lng = lng;
  this.distance = distance || "10km";
}

GeoQuery.prototype.toJSON = function() {
  var object = {};
  object.geo_distance = {};
  object.geo_distance.distance = this.distance;
  object.geo_distance[this.field] = {
    lat: this.lat,
    lon: this.lng
  };
  return object;
};




module.exports = {
  StringQuery: StringQuery,
  TermQuery: TermQuery,
  AndQuery: AndQuery,
  OrQuery: OrQuery,
  RangeQuery: RangeQuery,
  GeoQuery: GeoQuery
};
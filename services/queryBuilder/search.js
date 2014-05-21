var _ = require('lodash');

/**
 * Search object constructor
 */
var Search = function() {

};

Search.prototype = {

  toJSON: function() {
    var object = {},
        root = object;

    if (this._index) object.index = this._index;
    if (this._type) object.type = this._type;
    if (this._size) object.size = this._size;
    if (this._from) object.from = this._from;
    if (this._fields) object.fields = this._fields;

    if (this._filter && this._filter.toJSON()) {
      object.query = {};
      root = object.query.filtered = {};
      root.filter = this._filter.toJSON();
    };

    if (this._query && this._query.toJSON()) {
      root.query = this._query.toJSON();
    }

    return object;
  },

  query: function(query) {
    this._query = query;
    return this;
  },

  filter: function(filter) {
    this._filter = filter;
    return this;
  },

  index: function(index) {
    this._index = index;
    return this;
  },

  type: function(type) {
    this._type = type;
    return this;
  },

  size: function(size) {
    this._size = size;
    return this;
  },

  from: function(from) {
    this._from = from;
    return this;
  },

  fields: function(fields) {
    if (_.isString(fields)) {
      this._fields = fields.split(' ');
    }

    if (_.isArray(fields)) {
      this._fields = fields;
    }

    return this;
  }

};

module.exports = {
  Search: Search
};
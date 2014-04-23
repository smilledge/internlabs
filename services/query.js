var _ = require('lodash'),
    async = require('async'),
    Helpers = require('../helpers');

/**
 * Convert search object into a elasticsearch query
 */
var buildSearchQuery = function(input) {

  var defaultSize = 20,
      defaultOffset = 0,

      query = {
        size: input.perPage || defaultSize,
        from: (input.page && input.page > 1) ? (input.page-1) * defaultSize : defaultOffset,
        
        sort: [
          {
            "_score": {
              "order": "desc"
            }
          }
        ],

        query: {
          bool: {}
        },
        filter: {
          bool: {}
        }
      };


  // Text query
  if ( _.isString(input.query) ) {
    // Maybe parse the query here to extract keywords like "within XXkm of" or "in brisbane" or "my skills"
    query.query.bool.should = getTextQuery(input.query);
  }


  // Skills query
  if ( input.skills ) {
    var must = query.filter.bool.must = query.filter.bool.must || [];
    must.push(getSkillsQuery(Helpers.parseList(input.skills)));
  }


  // Remove the filter / query if empty
  var cruchObject = function(l, s, r) {return _.isObject(l)? (r = function(l) {return _.isObject(l)? _.flatten(_.map(l, s? _.identity:r)):l;})(l):[];};
  if ( ! _.compact(cruchObject(query.query)).length ) {
    delete query.query;
  }

  if ( ! _.compact(cruchObject(query.filter)).length ) {
    delete query.filter;
  }

  console.log(cruchObject(query.query));
  
  return query;
};



var getTextQuery = function(string) {
  return [
    {
      query_string: {
        query: string
      }
    }
  ];
};


var getSkillsQuery = function(skills) {

  if ( ! _.isArray(skills) ) {
    return null;
  }

  var skillList = _.map(skills, function(skill) {
    return '\"' + skill + '\"';
  }).join(' OR ');

  return {
    fquery: {
      query: {
        query_string: {
          query: 'skills:('+ skillList +')' // "skills:(\"Information Technology\" OR \"Web Technologies\")"
        }
      }
    }
  };
}




module.exports = {
  make: buildSearchQuery
}
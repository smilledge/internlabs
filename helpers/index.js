/**
 * General helper fucntions
 */

var _ = require('lodash');

module.exports = {


  parseList: function(list) {
    // Make sure skills is an array
    if ( _.isString(list) ) {
      list = list.split(',');
    }

    // Trim list, remove empty strings and remove duplicates
    return _.uniq(_.compact(_.map(list, function(item) {
      return item.trim();
    })));
  },


  parseSkills: function(skills) {
    return module.exports.parseList(skills);
  },


  /**
   * Parse a search query and morph into a mongo query object
   */
  parseSearchQuery: function(search) {

  }

}
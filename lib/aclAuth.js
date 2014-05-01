var _ = require('lodash');


/**
 * Mongoose plugin
 */
module.exports = function(schema) {

    /**
     * Does the provided subject have these perms...
     */
    schema.methods.hasAccess = function(subject, perms) {
        if ( ! subject ) {
            return false;
        }

        if ( ! perms ) {
            perms = ['read', 'write', 'delete'];
        }

        if ( _.isString(perms) ) {
            perms = [perms];
        }

        return _.difference(perms, subject.getAccess(this)) < 1;
    };

};
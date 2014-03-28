
'use strict';

var mongoose = require('mongoose'),
    nconf = require('nconf');


var profileModel = function () {

    var profileSchema = mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    });

    return mongoose.model('Profile', profileSchema);
};

module.exports = new profileModel();
'use strict';

var mongoose = require('mongoose');


var profileModel = function () {

    var profileSchema = mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        introduction: { type: String },
        university: { type: String },
        courseName: { type: String },
        linkedIn: { type: String },
        skills: { type: Array },
        resume: { type: String }
    });

    return mongoose.model('Profile', profileSchema);
};

module.exports = new profileModel();
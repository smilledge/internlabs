'use strict';

var mongoose = require('mongoose'),
    acl = require('mongoose-acl'),
    aclAuth = require('../lib/aclAuth');


var profileModel = function () {

    var ProfileSchema = mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        introduction: { type: String },
        university: { type: String },
        courseName: { type: String },
        linkedIn: { type: String },
        skills: { type: Array },
        resume: { type: String }
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });

    // Access control list
    ProfileSchema.plugin(acl.object);
    ProfileSchema.plugin(aclAuth);

    ProfileSchema.virtual('name').get(function() {
        return this.firstName + ' ' + this.lastName;
    });

    return mongoose.model('Profile', ProfileSchema);
};

module.exports = new profileModel();
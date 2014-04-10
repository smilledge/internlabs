'use strict';

var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    Role = require('./role');


var CompanyModel = function () {

    var CompanySchema = mongoose.Schema({
        name: { type: String, required: true },
        introduction: { type: String },
        website: { type: String },
        email: { type: String },
        logo: { type: String },
        address: { type: ObjectId, ref: 'Address', index: true },
        skills: { type: Array },
        roles: [{
            type: ObjectId,
            ref: 'Role'
        }]
    });

    return mongoose.model('Company', CompanySchema);
};

module.exports = new CompanyModel();
'use strict';

var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    mongoosastic = require('mongoosastic'),
    Role = require('./role'),
    nconf = require('nconf'),
    slug = require('slug');


var CompanyModel = function() {

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
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });

    // Index using elastic search
    CompanySchema.plugin(mongoosastic)

    CompanySchema.virtual('logoUrl').get(function() {
        if ( this.logo ) {
            return nconf.get('uploadsPath') + '/' + this.logo;
        }
    });

    CompanySchema.virtual('url').get(function() {
        if ( this._id && this.name ) {
            return '/company/' + this._id + '/' + slug(this.name).toLowerCase();
        }
    });

    return mongoose.model('Company', CompanySchema);
};

module.exports = new CompanyModel();
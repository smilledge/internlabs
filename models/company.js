'use strict';

var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    Role = require('./role'),
    User = require('./user'),
    Address = require('./address'),
    nconf = require('nconf'),
    slug = require('slug'),
    acl = require('mongoose-acl'),
    aclAuth = require('../lib/aclAuth'),
    SearchService = require('../services/search');


var CompanyModel = function() {

    var CompanySchema = mongoose.Schema({
        name: { type: String, required: true, es_indexed: true, es_boost:2.0 },
        introduction: { type: String },
        website: { type: String },
        email: { type: String },
        logo: { type: String },
        address: { type: ObjectId, ref: 'Address', es_indexed: true },
        skills: { type: Array, es_indexed: true, es_boost:1.6 },
        roles: [{
            type: ObjectId,
            ref: 'Role'
        }],
        createdAt: { type: Date, es_indexed: true },
        updatedAt: { type: Date, es_indexed: true }
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });


    // Access control list
    CompanySchema.plugin(acl.object);
    CompanySchema.plugin(aclAuth);

    // Plugin the company indexer
    CompanySchema.plugin(SearchService.company.plugin, {});

    CompanySchema.pre('save', function(next){
        var now = new Date();
        this.updatedAt = now;

        if ( ! this.created_at ) {
            this.createdAt = now;
        }

        next();
    });

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
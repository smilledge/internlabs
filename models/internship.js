'use strict';

var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    Role = require('./role'),
    User = require('./user'),
    Address = require('./address'),
    nconf = require('nconf'),
    acl = require('mongoose-acl'),
    aclAuth = require('../lib/aclAuth'),
    slug = require('slug');


var InternshipModel = function() {

    var InternshipSchema = mongoose.Schema({
        student: { type: ObjectId, ref: 'User' },
        company: { type: ObjectId, ref: 'Company' },
        supervisors: [{ type: ObjectId, ref: 'User' }],
        status: { type: String }, // 'pending', 'active', 'completed', 'cancelled', 'unsuccessful'
        role: {
            title: { type: String },
            description: { type: String }
        },
        startDate: { type: Date },
        endDate: { type: Date },
        totalHours: { type: Number },
        activity: [{
            description: { type: String },
            author: { type: ObjectId, ref: 'User' },
            createdAt: { type: Date, default: Date.now }
        }],
        interview: {
            location: {},
            date: { type: Date },
            startTime: { type: String },
            endTime: { type: String }
        },
        schedule: [{
            date: { type: Date },
            startTime: { type: String },
            endTime: { type: String }
        }],
        documents: [{
            name: { type: String },
            file: { type: String },
            type: { type: String },
            author: { type: ObjectId, ref: 'User' },
            createdAt: { type: Date, default: Date.now }
        }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });


    // Access control list
    InternshipSchema.plugin(acl.object);
    InternshipSchema.plugin(aclAuth);


    /**
     * Add item to the activity stream
     */
    InternshipSchema.methods.addActivity = function(activity, callback) {
        console.log(activity);
        this.activity.push(activity);
        this.save(callback);
    };


    InternshipSchema.pre('save', function(next){
        var now = new Date();
        this.updatedAt = now;

        if ( ! this.created_at ) {
            this.createdAt = now;
        }

        next();
    });

    InternshipSchema.statics.getUrl = function(internship) {
        var url = "/internship/" + internship._id + "/";

        if (internship.role && internship.role.title) {
            url += slug(internship.role.title).toLowerCase();

            if (internship.company && internship.company.name) {
                url += "-at-" + slug(internship.company.name).toLowerCase();
            }
        }

        return url;
    }

    InternshipSchema.virtual('url').get(function() {
        return InternshipSchema.statics.getUrl();
    });

    return mongoose.model('Internship', InternshipSchema);
};

module.exports = new InternshipModel();
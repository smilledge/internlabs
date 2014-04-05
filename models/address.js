'use strict';

var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    geocoder = require('node-geocoder').getGeocoder('google', 'http', {}),
    _ = require('lodash');


var AddressModel = function () {

    var AddressSchema = mongoose.Schema({
        line1: { type: String },
        line2: { type: String },
        city: { type: String },
        postcode: { type: Number },
        state: { type: String },
        country: { type: String },
        lat: { type: String },
        lng: { type: String }
    });


    /**
     * Get the lat / lng on save
     */
    AddressSchema.pre('save', function (next) {
        var address = this;

        if ( ! address.isNew && ! address.isModified() ) {
            return next();
        }

        var addressString = [
            address.line1, address.line2, address.city,
            address.state, address.postcode, address.country
        ].join(', ');

        geocoder.geocode(addressString, function(err, response) {
            if ( err || _.isEmpty(response) ) {
                return next();
            }

            address.lat = response[0].latitude;
            address.lng = response[0].longitude;
            next();
        });        
    });


    return mongoose.model('Address', AddressSchema);
};

module.exports = new AddressModel();
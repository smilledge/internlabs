'use strict';

var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    geocoder = require('node-geocoder').getGeocoder('google', 'http', {}),
    _ = require('lodash');


var AddressModel = function () {

    var AddressSchema = mongoose.Schema({
        line1: { type: String },
        line2: { type: String },
        city: { type: String, es_indexed: true, es_boost: 1.8 },
        postcode: { type: Number },
        state: { type: String, es_indexed: true, es_boost: 1.5 },
        country: { type: String, es_indexed: true, es_boost: 1.1 },
        lat: { type: String, es_indexed: true },
        lng: { type: String, es_indexed: true }
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
            if ( err || _.isEmpty(response[0]) || ! response[0].latitude  ) {
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
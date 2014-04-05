'use strict';

var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId;


var AddressModel = function () {

    var AddressSchema = mongoose.Schema({
        line1: { type: String },
        line2: { type: String },
        city: { type: String },
        postcode: { type: Number },
        state: { type: String },
        country: { type: String }
    });

    return mongoose.model('Address', AddressSchema);
};

module.exports = new AddressModel();
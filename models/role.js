'use strict';

var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId;


var RoleModel = function () {

    var RoleSchema = mongoose.Schema({
        title: { type: String, required: true },
        description: { type: String }
    });

    return mongoose.model('Role', RoleSchema);
};

module.exports = new RoleModel();
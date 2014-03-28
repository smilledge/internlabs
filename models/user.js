
'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    nconf = require('nconf');


var userModel = function () {

    var userSchema = mongoose.Schema({
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        type: { type: String, unique: false, default: "student" }, // student, employer, supervisor
        profile: { type: mongoose.Schema.ObjectId }
    });

    /**
     * Helper function that hooks into the 'save' method, and replaces plaintext passwords with a hashed version.
     */
    userSchema.pre('save', function (next) {
        var user = this;

        if ( ! user.isModified('password') ) {
            next();
            return;
        }

        //Encrypt it using bCrypt
        var hashedPwd = bcrypt.hashSync(user.password, 8);

        //Replace the plaintext pw with the Hash+Salted pw;
        user.password = hashedPwd;

        //Continue with the save operation
        next();
    });

    /**
     * Helper function that takes a plaintext password and compares it against the user's hashed password.
     * @param plainText
     * @returns true/false
     */
    userSchema.methods.passwordMatches = function(plainText) {
        var user = this;
        return bcrypt.compareSync(plainText, user.password);
    };


    return mongoose.model('User', userSchema);
};

module.exports = new userModel();
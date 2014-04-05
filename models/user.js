
'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    ObjectId = mongoose.Schema.ObjectId;


var UserModel = function () {

    var UserSchema = mongoose.Schema({
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        type: { type: String, unique: false, default: "student" }, // student, employer, supervisor
        profile: { type: ObjectId, ref: 'Profile', index: true },
        company: { type: ObjectId, ref: 'Company', index: true },
        activationToken: { type: String },
        resetToken: { type: String },
        activated: { type: Boolean, default: false }
    });

    /**
     * Helper function that hooks into the 'save' method, and replaces plaintext passwords with a hashed version.
     */
    UserSchema.pre('save', function (next) {
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
     * When the user signs up create a new activation token
     */
    UserSchema.pre('save', function (next) {
        var user = this;

        // Only create for new users
        if ( ! user.isNew ) {
            next();
            return;
        }

        user.activationToken = bcrypt.hashSync(new Date().getTime() + user.email, 10);
        user.activated = false;

        next();
    });

    /**
     * Helper function that takes a plaintext password and compares it against the user's hashed password.
     * @param plainText
     * @returns true/false
     */
    UserSchema.methods.passwordMatches = function(plainText) {
        var user = this;
        return bcrypt.compareSync(plainText, user.password);
    };

    /**
     * Get a reset token
     */
    UserSchema.methods.getResetToken = function(plainText) {
        return bcrypt.hashSync(new Date().getTime() + this.email, 10);
    };


    return mongoose.model('User', UserSchema);
};

module.exports = new UserModel();
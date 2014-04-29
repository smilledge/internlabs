var Internship = require('../models/internship'),
    Profile = require('../models/profile'),
    User = require('../models/user'),
    Company = require('../models/company'),
    async = require('async'),
    _ = require('lodash'),
    Helpers = require('../helpers');


/**
 * Get all internships for a user
 * 
 * @param  {string}   user _id 
 * @param  {function} done
 * @return {void}
 */
module.exports.findByUser = function(user, done) {

  if (user._id) {
    user = user._id;
  }

  async.waterfall([

    /**
     * Get the student
     */
    function(callback) {
      User.findById(user).lean().populate('profile').exec(function(err, student) {
        if ( err || ! student ) {
          return callback(new Error("Student not found."));
        }
        callback(null, student);
      });
    },

    /**
     * Get the internship
     */
    function(student, callback) {
      Internship.find({
        student: student._id
      }).lean().populate('company student').exec(function(err, internships) {
        if ( err || ! internships ) {
          return callback(new Error("Could not find any matching internships."));
        }

        callback(null, student, internships);
      });
    },

    /**
     * Populate the students profile and internship url
     * (URL virtual gets stripped out when running lean())
     */
    function(student, internships, callback) {
      _.each(internships, function(internship) {
        internship.url = Internship.getUrl(internship);
        internship.student.profile = student.profile;
      });
      callback(null, internships);
    }

  ], done);
};


/**
 * Git an internship by id
 * 
 * @param  {string}   internshipId 
 * @param  {function} done
 * @return {void}
 */
module.exports.findById = function(internshipId, done) {
  async.waterfall([

    /**
     * Get internship / student / company
     */
    function(callback) {
      Internship.findById(internshipId)
      .lean()
      .populate('company student')
      .exec(function(err, internship) {
        if ( err || ! internship ) {
          return callback(new Error('Could not find internship'));
        }
        callback(null, internship);
      });
    },

    /**
     * Populate the student profile
     */
    function(internship, callback) {
      Profile.findById(internship.student.profile, function(err, profile) {
        if ( err || ! profile ) {
          return callback(null, internship);
        }
        internship.student.profile = profile;
        callback(null, internship);
      });
    }

  ], done);
};



/**
 * Create a new internship
 *
 * @param  {object}   data
 * @param  {func}     callback
 * @return {void}
 */
module.exports.create = function(data, done) {

  var comment;
  if ( data.comment ) {
    comment = data.comment;
    delete data.comment;
  }


  async.waterfall([


    /**
     * Get the company
     */
    function(callback) {
      if ( ! data.company ) {
        return callback(new Error("Company not found."));
      }

      if ( ! _.isUndefined(data.company._id) ) {
        data.company = data.company._id;
      }

      Company.findById(data.company, function(err, company) {
        if ( err || ! company ) {
          return callback(new Error("Company not found."));
        }

        callback(err, company);
      });
    },


    /**
     * Get the student
     */
    function(company, callback) {
      if ( ! data.student ) {
        return callback(new Error("Student not found."));
      }

      if ( ! _.isUndefined(data.student._id) ) {
        data.student = data.student._id;
      }


      User.findById(data.student).populate('profile').exec(function(err, student) {
        if ( err || ! student ) {
          return callback(new Error("Student not found."));
        }

        if ( student.type !== 'student' ) {
          return callback(new Error("You must be a student to apply for an internship."));
        }

        callback(null, company, student);
      });
    },


    /**
     * Create the inteview is one is provided
     */
    
    /**
     * Add schedule if provided
     */

    /**
     * Attach documents if provided
     */


    /**
     * Create the internship
     */
    function(company, student, callback) {
      new Internship(_.extend({}, data, {
        company: company._id,
        student: student._id
      })).save(function(err, internship) {
        if ( err || ! internship ) {
          return callback(new Error("Could not create internship."));
        }

        callback(null, company, student, internship);
      });
    },


    /**
     * Update the activity stream
     */
    function(company, student, internship, callback) {
      var msg = student.profile.name + ' applied for an internship at ' + company.name;

      internship.addActivity({
        description: msg,
        author: student._id
      }, function(err, activity) {
        callback(null, company, student, internship);
      });
    },


    /**
     * Add comments to the activity stream
     */
    function(company, student, internship, callback) {
      if (comment) {
        internship.addActivity({
          description: comment,
          author: student._id
        }, function(err, activity) {
          callback(null, company, student, internship);
        });
      } else {
        callback(null, company, student, internship);
      }
    },


    /**
     * Setup access control list
     */
    function(company, student, internship, callback) {

      // Student has full access
      student.setAccess(internship, ['read', 'write', 'delete']);

      // Get all users who have access to comapny
      User.find({
        company: company._id
      }, {
        _id: 1
      }, function(err, users) {
        _.each(users, function(user) {
          user.setAccess(internship, ['read', 'write', 'delete']);
        });
        
        internship.save(function() {
          callback(null, internship);
        });
      });
    }
    

    /**
     * Send email to company to notify of new application
     */

  ], done);

};


/**
 * Add an interview to an internship
 *
 * @param  {object}   data
 * @param  {func}     callback
 * @return {void}
 */
module.exports.saveInterview = function(data, done) {

  async.waterfall([

    // Get the internship

    // Geocode the location

  ], done);

};
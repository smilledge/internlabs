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
      User.findById(user).populate('profile').exec(function(err, student) {
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
      }).populate('company student').exec(function(err, internships) {
        if ( err || ! internships ) {
          return callback(new Error("Could not find any matching internships."));
        }

        callback(null, student, internships);
      });
    },

    /**
     * Populate the students profile
     */
    function(student, internships, callback) {
      Profile.populate(internships, {
        path: 'student.profile'
      }, callback);
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
      Profile.populate(internship, {
        path: 'student.profile'
      }, callback);
    },

    /**
     * Populate the activities author
     */
    function(internship, callback) {
      User.populate(internship, {
        path: 'activity.author'
      }, function(err, internship) {
        Profile.populate(internship, {
          path: 'activity.author.profile',
          select: {
            firstName: 1,
            lastName: 1,
            name: 1
          }
        }, callback);
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
        priority: 2,
        type: 'update'
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
          author: student._id,
          priority: 3,
          type: 'message'
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


/**
 * Add an interview to an internship
 *
 * @param  {string}   internship ID
 * @param  {string}   user ID
 * @param  {object}   data
 * @param  {func}     callback
 * @return {void}
 */
module.exports.createSchedule = function(internship, user, data, done) {

  async.waterfall([

    /**
     * Get the internship
     */
    function(callback) {
      Internship.findById(internship._id || internship, function(err, internship) {
        if ( err || ! internship ) {
          return callback(new Error("Internship could not be found."));
        }
        callback(null, internship);
      });
    },

    /**
     * Get the user
     */
    function(internship, callback) {
      User.findById(user._id || user).populate('profile').exec(function(err, user) {
        if ( err || ! user ) {
          return callback(new Error("An error occured while updating your schedule. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Check the user has access to the internship
     */
    function(internship, user, callback) {
      if ( ! internship.hasAccess(user, 'write') ) {
        return callback(new Error('You are not authorized to edit this schedule.'));
      }
      callback(null, internship, user);
    },

    /**
     * Update the internship schedule
     */
    function(internship, user, callback) {
      internship.schedule = data;
      internship.save(function(err, internship) {
        if ( err || ! internship ) {
          return callback(new Error("An error occured while updating your schedule. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Add an activity to the internships feed
     */
    function(internship, user, callback) {
      var msg = user.profile.name + ' updated the internship\'s schedule.';

      internship.addActivity({
        description: msg
      }, function(err, activity) {
        callback(null, internship.schedule);
      });
    }


  ], done);

};


/**
 * Add a message to the internship
 *
 * @param  {string}   internship ID
 * @param  {string}   user ID
 * @param  {string}   message string
 * @param  {func}     callback
 * @return {void}
 */
module.exports.createMessage = function(internship, user, message, done) {

  async.waterfall([

    /**
     * Get the internship
     */
    function(callback) {
      Internship.findById(internship._id || internship, function(err, internship) {
        if ( err || ! internship ) {
          return callback(new Error("Internship could not be found."));
        }
        callback(null, internship);
      });
    },

    /**
     * Get the user
     */
    function(internship, callback) {
      User.findById(user._id || user).populate('profile').exec(function(err, user) {
        if ( err || ! user ) {
          return callback(new Error("An error occured while saving your message. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Check the user has access to the internship
     */
    function(internship, user, callback) {
      if ( ! internship.hasAccess(user, 'write') ) {
        return callback(new Error('You are not authorized to post messages to this internship.'));
      }
      callback(null, internship, user);
    },

    /**
     * Add a message to the internships feed
     */
    function(internship, user, callback) {
      internship.addActivity({
        description: message,
        author: user._id,
        type: 'message',
        priority: 3
      }, function(err, internship) {
        callback(null, internship);
      });
    }


  ], done);

};



/**
 * Delete an item from activity feed
 *
 * @param  {string}   internship ID
 * @param  {string}   user ID
 * @param  {string}   activity ID
 * @param  {func}     callback
 * @return {void}
 */
module.exports.deleteActivity = function(internship, user, activityId, done) {

  async.waterfall([

    /**
     * Get the internship
     */
    function(callback) {
      Internship.findById(internship._id || internship, function(err, internship) {
        if ( err || ! internship ) {
          return callback(new Error("Internship could not be found."));
        }
        callback(null, internship);
      });
    },

    /**
     * Get the user
     */
    function(internship, callback) {
      User.findById(user._id || user).populate('profile').exec(function(err, user) {
        if ( err || ! user ) {
          return callback(new Error("An error occured while deleteing. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Check the user has delete access to the internship
     */
    function(internship, user, callback) {
      if ( ! internship.hasAccess(user, 'write', 'delete') ) {
        return callback(new Error('You are not authorized to delete messages in this internship.'));
      }
      callback(null, internship, user);
    },

    /**
     * Delete the message
     */
    function(internship, user, callback) {
      internship.activity = _.filter(internship.activity, function(activity) {
        return activity._id != activityId;
      });
      internship.save(done);
    }


  ], done);

};


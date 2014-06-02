var Internship = require('../models/internship'),
    Profile = require('../models/profile'),
    User = require('../models/user'),
    Company = require('../models/company'),
    async = require('async'),
    _ = require('lodash'),
    Helpers = require('../helpers'),
    moment = require('moment'),
    fs = require('fs'),
    path = require('path'),
    nconf = require('nconf'),
    mailer = require('../lib/mailer');


/**
 * Get the uploads directory
 */
var getUploadsDir = function() {
  return __dirname + '/../public/uploads/';
}


/**
 * Get all internships for a user
 * 
 * @param  {string}   user _id 
 * @param  {function} done
 * @return {void}
 */
module.exports.findByUser = function(user, query, done) {

  if (_.isFunction(query)) {
    done = query;
    query = {};
  }

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

      var find = _.pick(query, 'status');

      Internship.find(_.extend(find, {
        student: student._id
      })).populate('company student').exec(function(err, internships) {
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
 * Get all internships for a company
 * 
 * @param  {string}   company _id 
 * @param  {function} done
 * @return {void}
 */
module.exports.findByCompany = function(company, query, done) {
  async.waterfall([

    /**
     * Get the internships
     */
    function(callback) {

      var find = _.pick(query, 'status');
      
      Internship.find(_.extend(find, {
        company: company
      })).populate('company student').exec(function(err, internships) {
        if ( err || ! internships ) {
          return callback(new Error("Could not find any matching internships."));
        }

        callback(null, internships);
      });
    },

    /**
     * Populate the students profile
     */
    function(internships, callback) {
      Profile.populate(internships, {
        path: 'student.profile'
      }, callback);
    }

  ], done);
};


/**
 * Get all internships by a supervisor
 * 
 * @param  {string}   supervisor _id 
 * @param  {function} done
 * @return {void}
 */
module.exports.findBySupervisor = function(supervisor, query, done) {
  async.waterfall([

    /**
     * Get the internships
     */
    function(callback) {

      var find = _.pick(query, 'status');
      
      Internship.find(_.extend(find, {
        supervisors: supervisor._id || supervisor
      })).populate('company student').exec(function(err, internships) {
        if ( err || ! internships ) {
          return callback(new Error("Could not find any matching internships."));
        }

        callback(null, internships);
      });
    },

    /**
     * Populate the students profile
     */
    function(internships, callback) {
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
      .populate('company student supervisors')
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
     * Populate the supervisors profile
     */
    function(internship, callback) {
      Profile.populate(internship, {
        path: 'supervisors.profile',
        select: {
          firstName: 1,
          lastName: 1,
          name: 1,
          email: 1
        }
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

      if ( ! data.date ) {
        return callback(new Error('Error creating schedule. The date provided was invalid.'));
      }

      data.date = new Date(data.date);

      // Merge with existing schedule
      var current = internship.schedule || [];
      var newSchedule = _.union(current, [data]);

      // Sort for date             
      newSchedule = _.sortBy(newSchedule, function(item) {
        return new Date(item.date).getTime();
      });

      internship.schedule = newSchedule;
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
        callback(null, internship);
      });
    }


  ], done);

};



/**
 * Delete a schedule
 *
 * @param  {string}   internship ID
 * @param  {string}   user ID
 * @param  {object}   schedule id
 * @param  {func}     callback
 * @return {void}
 */
module.exports.deleteSchedule = function(internship, user, scheduleId, done) {

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
      if ( ! internship.hasAccess(user, 'delete') ) {
        return callback(new Error('You are not authorized to edit this schedule.'));
      }
      callback(null, internship, user);
    },

    /**
     * Delete the internship schedule
     */
    function(internship, user, callback) {
      var toRemove = _.find(internship.schedule, function(item) {
        return item._id.toString() === scheduleId;
      });

      internship.schedule = _.without(internship.schedule, toRemove);

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
        callback(null, internship);
      });
    }


  ], done);

};


/**
 * Change the internship's status (pending, active, active, completed)
 *
 * @param  {string}   internship ID
 * @param  {string}   user ID
 * @param  {string}   status
 * @param  {func}     callback
 * @return {void}
 */
module.exports.changeStatus = function(internship, user, status, done) {

  async.waterfall([

    /**
     * Get the internship
     */
    function(callback) {
      Internship.findById(internship._id || internship).populate('company').exec(function(err, internship) {
        if ( err || ! internship ) {
          return callback(new Error("Internship could not be found."));
        }
        callback(null, internship);
      });
    },

    /**
     * Get the company
     */
    function(internship, callback) {
      User.findById(user).populate('company').exec(function(err, user) {
        if ( err || ! user ) {
          return callback(new Error("An error occured while updating the internship. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Check the user has access to the internship
     * Check the user is the company owner
     */
    function(internship, user, callback) {
      if ( ! internship.hasAccess(user, 'write') ) {
        return callback(new Error('You are not authorized to manage this internship.'));
      }

      if ( ! user.company || internship.company._id.toString() != user.company._id.toString() ) {
        return callback(new Error('Only the internship adminstrator can change the status of the internship.'));
      }

      callback(null, internship, user);
    },

    /**
     * Set the status
     */
    function(internship, user, callback) {
      internship.status = status;

      internship.save(function(err, internship) {
        if ( err || ! internship ) {
          return callback(new Error("An error occured while updating the internship. Please try again later."));
        }

        internship.addActivity({
          description: user.company.name + " changed the status of the internship to " + status,
          type: 'update',
          priority: 2
        }, function(err, internship) {
          callback(null, internship);
        });
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
      if ( ! internship.hasAccess(user, ['write', 'delete']) ) {
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



/**
 * Add a supervisor to the internship
 *
 * @param  {string}   internship ID
 * @param  {string}   user ID
 * @param  {string}   supervisor email address
 * @param  {func}     callback
 * @return {void}
 */
module.exports.createSupervisor = function(internship, user, email, done) {

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
          return callback(new Error("An error occured while adding a supervisor. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Check the user has delete access to the internship
     */
    function(internship, user, callback) {
      if ( ! internship.hasAccess(user, 'write') ) {
        return callback(new Error('You are not authorized to add supervisors to this internship.'));
      }
      callback(null, internship, user);
    },

    /**
     * Check if the supervisor is a current user
     */
    function(internship, user, callback) {
      User.findOne({
        email: email
      }, function(err, supervisor) {
        if ( err || ! supervisor ) {
          return callback(null, email, internship, user);
        }
        callback(null, supervisor, internship, user);
      });
    },

    /**
     * Add the supervisor to the internship
     */
    function(supervisor, internship, user, callback) {
      if ( _.isObject(supervisor) ) {
        internship.supervisors.push(supervisor._id);
        internship.save(function(err, internship) {
          callback(null, supervisor, internship, user);
        });
      } else {
        internship.invitedSupervisors.push({
          email: supervisor
        });
        internship.save(function(err, internship) {
          callback(null, supervisor, internship, user);
        });
      }
    },

    /**
     * Give the new supervisor read/write permission if they are already a user
     */
    function(supervisor, internship, user, callback) {
      if ( ! _.isObject(supervisor) ) {
        return callback(null, supervisor, internship, user);
      }
      supervisor.setAccess(internship, ['read', 'write']);
      internship.save(function(err, internship) {
        callback(null, supervisor, internship, user);
      });
    },
    
    /**
     * Send an invite email if the supervisor is not a user
     */
    function(supervisor, internship, user, callback) {
      if ( _.isObject(supervisor) ) {
        return callback(null, supervisor, internship, user);
      }

      mailer.send({
        to: email,
        subject: user.profile.name + " has invited you to supervise an internship on InternLabs",
        template: "invite-supervisor.ejs",
        model: {
          inviteUrl: nconf.get("url") + 'signup/supervisor?email=' + email,
          user: user,
          internship: internship
        }
      }, function(err) {
        callback(null, supervisor, internship, user);
      });
    },

    /**
     * Add to the activity feed
     */
    function(supervisor, internship, user, callback) {
      var display = ( _.isObject(supervisor) ) ? supervisor.email : supervisor;
      var msg = user.profile.name + ' added ' + display + ' as a supervisor of this internship.';

      internship.addActivity({
        description: msg,
        priority: 2,
        type: 'update'
      }, function(err, activity) {
        callback(null, internship);
      });
    }

  ], done);

};



/**
 * Delete a supervisor from an internship
 *
 * @param  {string}   internship ID
 * @param  {string}   user ID
 * @param  {string}   supervisor email address
 * @param  {func}     callback
 * @return {void}
 */
module.exports.deleteSupervisor = function(internship, user, email, done) {

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
          return callback(new Error("An error occured while removeing the supervisor. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Check the user has delete access to the internship
     */
    function(internship, user, callback) {
      if ( ! internship.hasAccess(user, 'write') ) {
        return callback(new Error('You are not authorized to remove supervisors from this internship.'));
      }
      callback(null, internship, user);
    },

    /**
     * Get the matching supervisor user (if exists)
     */
    function(internship, user, callback) {
      User.findOne({
        email: email
      }, function(err, supervisor) {
        if ( err || ! supervisor ) {
          return callback(null, email, internship, user);
        }
        callback(null, supervisor, internship, user);
      });
    },

    /**
     * Remove the supervisor from the internship
     */
    function(supervisor, internship, user, callback) {
      if ( _.isObject(supervisor) ) {

        var removing = _.map(internship.supervisors, function(item) {
          if ( item.toString() == supervisor._id.toString() ) {
            return item.toString();
          }
        });

        internship.supervisors = _.filter(internship.supervisors, function(item) {
          return _.indexOf(removing, item.toString()) < 0;
        });

        internship.save(function(err, internship) {
          callback(null, supervisor, internship, user);
        });
      } else {
        var removing = _.map(internship.invitedSupervisors, function(item) {
          if (item.email == supervisor) {
            return item.email;
          }
        });

        internship.invitedSupervisors = _.filter(internship.invitedSupervisors, function(item) {
          return _.indexOf(removing, item.email) < 0;
        });

        internship.save(function(err, internship) {
          callback(null, supervisor, internship, user);
        });
      }
    },

    /**
     * Remore supervisor from ACL
     */
    function(supervisor, internship, user, callback) {
      if ( _.isObject(supervisor) ) {
        supervisor.setAccess(internship, null);
        internship.save(function(err, internship) {
          callback(null, supervisor, internship, user);
        });
      } else {
        callback(null, supervisor, internship, user);
      }
    },

    /**
     * Add to the activity feed
     */
    function(supervisor, internship, user, callback) {
      var display = ( _.isObject(supervisor) ) ? supervisor.email : supervisor;
      var msg = user.profile.name + ' removed ' + display + ' as a supervisor of this internship.';

      internship.addActivity({
        description: msg,
        priority: 1,
        type: 'update'
      }, function(err, activity) {
        callback(null, internship);
      });
    }

  ], done);

};



/**
 * Create the interview
 *
 * @param  {string}   internship ID
 * @param  {string}   user ID
 * @param  {object}   interview data
 * @param  {func}     callback
 * @return {void}
 */
module.exports.createInterview = function(internship, user, data, done) {

  var comment = data.comment;
  delete data.comment;

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
          return callback(new Error("An error occured while saving the interview. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Check the user has delete access to the internship
     */
    function(internship, user, callback) {
      if ( ! internship.hasAccess(user, 'write') && user.type != 'student' ) {
        return callback(new Error('You are not authorized to save interviews for this internship.'));
      }
      callback(null, internship, user);
    },

    /**
     * Save the interview
     */
    function(internship, user, callback) {
      internship.interview = data;
      internship.save(function(err, internship) {
        if ( err || ! internship ) {
          return callback(new Error("An error occured while saving the interview. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Add to the activity feed
     */
    function(internship, user, callback) {
      var date = moment(internship.interview.date).format("dddd, MMMM Do YYYY"),
          from = internship.interview.startTime,
          to = internship.interview.endTime;

      var msg = user.profile.name + ' scheduled an interview on ' + date + ' from ' + from + ' to ' + to;

      internship.addActivity({
        description: msg,
        priority: 2,
        type: 'event'
      }, function(err, activity) {
        callback(null, internship, user);
      });
    },

    /**
     * Add comments to the activty feed
     */
    function(internship, user, callback) {
      if ( ! comment || ! comment.length ) {
        return callback(null, internship);
      }

      internship.addActivity({
        description: comment,
        priority: 3,
        type: 'message',
        author: user
      }, function(err, activity) {
        callback(null, internship);
      });
    }

  ], done);

};


/**
 * Cancel an interview
 *
 * @param  {string}   internship ID
 * @param  {string}   user ID
 * @param  {func}     callback
 * @return {void}
 */
module.exports.deleteInterview = function(internship, user, done) {

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
          return callback(new Error("An error occured while canceling the interview. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Check the user has delete access to the internship
     */
    function(internship, user, callback) {
      if ( ! internship.hasAccess(user, 'delete') ) {
        return callback(new Error('You are not authorized to cancel interviews on this internship.'));
      }
      callback(null, internship, user);
    },

    /**
     * Delete the interview
     */
    function(internship, user, callback) {
      internship.interview = undefined;
      internship.save(function(err, internship) {
        callback(null, internship, user);
      });
    },

    /**
     * Add comments to the activty feed
     */
    function(internship, user, callback) {
      var msg = user.profile.name + " canceled the scheduled interview.";

      internship.addActivity({
        description: msg,
        priority: 2,
        type: 'update'
      }, function(err, activity) {
        callback(null, internship);
      });
    }

  ], done);

};



/**
 * Upload a document
 *
 * @param  {string}   internship ID
 * @param  {string}   user ID
 * @param  {string}   file
 * @return {void}
 */
module.exports.uploadDocument = function(internship, user, file, done) {

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
          return callback(new Error("An error occured while uploading the file. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Check the user has write access to the internship
     */
    function(internship, user, callback) {
      if ( ! internship.hasAccess(user, 'write') ) {
        return callback(new Error('You are not authorized to upload documents on this internship.'));
      }
      callback(null, internship, user);
    },

    /**
     * Upload the file
     */
    function(internship, user, callback) {

      if ( _.isObject(file) ) {
        var ext = path.extname(file.name),
            originalFile = file.name.split('.')[0];
        file = file.path;
      }

      fs.readFile(file, function (err, data) {
        if ( err ) {
          return callback(err, null);
        }

        var fileName = 'attachment-' + internship._id + '-' + new Date().getTime() + (ext || path.extname(file));
        var newUri = getUploadsDir() + fileName;

        fs.writeFile(newUri, data, function(err) {
          internship.documents.push({
            name: originalFile,
            file: fileName,
            author: user._id
          });
          internship.save(function(err, internship) {
            callback(err, internship, user);
          });
        });
      });
    },


    /**
     * Add to the activty feed
     */
    function(internship, user, callback) {
      var msg = user.profile.name + " uploaded a file.";

      internship.addActivity({
        description: msg,
        priority: 1,
        author: user._id,
        type: 'update'
      }, function(err, activity) {
        callback(null, internship);
      });
    }

  ], done);

};




/**
 * Update a document
 *
 * @param  {string}   internship ID
 * @param  {string}   user ID
 * @param  {object}   document data
 * @return {void}
 */
module.exports.editDocument = function(internship, user, data, done) {

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
          return callback(new Error("An error occured while saving the document. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Check the user has write access to the internship
     */
    function(internship, user, callback) {
      if ( ! internship.hasAccess(user, 'write') ) {
        return callback(new Error('You are not authorized to edit documents on this internship.'));
      }
      callback(null, internship, user);
    },

    /**
     * Edit the document
     */
    function(internship, user, callback) {

      _.each(internship.documents, function(item) {
        if (item._id == data._id) {
          _.extend(item, data);
        }
      });

      internship.save(function(err, internship) {
        callback(err, internship);
      });
    }

  ], done);

};



/**
 * Delete a document
 *
 * @param  {string}   internship ID
 * @param  {string}   user ID
 * @param  {object}   document id
 * @param  {func}     callback
 * @return {void}
 */
module.exports.deleteDocument = function(internship, user, documentId, done) {

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
          return callback(new Error("An error occured while deleting the attachement. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Check the user has access to the internship
     */
    function(internship, user, callback) {
      if ( ! internship.hasAccess(user, 'delete') ) {
        return callback(new Error('You are not authorized to edit this internship.'));
      }
      callback(null, internship, user);
    },

    /**
     * Delete the internship document
     */
    function(internship, user, callback) {
      var toRemove = _.find(internship.documents, function(item) {
        return item._id.toString() === documentId;
      });

      // Delete the file
      var removePath = getUploadsDir() + toRemove.file;
      fs.unlink(removePath, function(err) {
        if (err) console.log(err);
      })

      internship.documents = _.without(internship.documents, toRemove);

      internship.save(function(err, internship) {
        if ( err || ! internship ) {
          return callback(new Error("An error occured while updating your internship. Please try again later."));
        }
        callback(null, internship, user);
      });
    },

    /**
     * Add an activity to the internships feed
     */
    function(internship, user, callback) {
      var msg = user.profile.name + ' removed a document from the internship.';

      internship.addActivity({
        description: msg,
        author: user._id,
        priority: 1,
        type: 'update'
      }, function(err, activity) {
        callback(null, internship);
      });
    }


  ], done);

};
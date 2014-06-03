var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    UserService = require('../../services/user'),
    CompanyService = require('../../services/company'),
    SearchService = require('../../services/search'),
    InternshipService = require('../../services/internship'),
    Company = require('../../models/company'),
    User = require('../../models/user'),
    Internship = require('../../models/internship'),
    request = require('request');


var internshipData = require('./data/internships.json'),
    tasks = [],
    companies = null,
    students = null,
    pairs = [];


var seed = function(callback) {

  console.log("+---------------------+");
  console.log("| Seeding internships |");
  console.log("+---------------------+");


  /**
   * Get some data
   */
  tasks.push(function(callback) {
    console.log("  | ---> Getting list of companies and students");

    Company.find().populate('address roles').exec(function(err, results) {
      companies = results;
      console.log("    | ---> Found companies: " + results.length);

      User.find({
        type: 'student'
      }).populate('profile').exec(function(err, results) {
        students = results;
        console.log("    | ---> Found students: " + results.length);

        // Create 30 internship pairs
        for (var i = 0; i < 100; i++) {
          pairs.push({
            student: _.sample(students),
            company: _.sample(companies)
          });
        };

        callback();
      });
    });

  });



  /**
   * Create the intenships
   */
  tasks.push(function(callback) {
    console.log("  | ---> Creating interships");

    // Create the import tasks models
    async.eachSeries(pairs, function(pair, done) {
        console.log("    | ---> Creating intership: " + pair.student.profile.name + " at " + pair.company.name);
        
        var role;

        if (pair.company.roles.length) {
          role = _.sample(pair.company.roles);
          console.log("      | ---> Applying for role: " + role.title);
        }

        var data = _.extend({}, _.sample(internshipData), {
          student: pair.student._id,
          company: pair.company._id,
          role: { 
            title: (role) ? role.title : "Internship",
            description: (role) ? role.description : ""
          }
        });

        InternshipService.create(data, function(err, internship) {
          if (err) {
            console.log("      | ---> Error creating internship: " + err.message);
            return;
          }
          done();
        });

        
    }, callback);
  });



  /**
   * Simulate some usage
   */
  tasks.push(function(callback) {
    console.log("  | ---> Simulating some internship progress");

    Internship.find().exec(function(err, internships) {

      // Create the import tasks models
      async.eachSeries(internships, function(internship, done) {
        var scenario = _.random(0, 5),
          companyUser = null;

        console.log("    | ---> Simulation activity on internship: " + internship._id);

        // Pending internship
        async.series([

          function(next) {
            User.findOne({ company: internship.company }, function(err, user) {
              companyUser = user._id;
              next();
            });
          },

          // Rejected
          function(next) {
            if (scenario === 2) {
              async.series([
                function(cb) { console.log("      | ---> commenting on internship"); InternshipService.createMessage(internship._id, companyUser, "Sorry, we do not have any available position at the moment.", cb); },
                function(cb) { console.log("      | ---> changing ststus of internship"); InternshipService.changeStatus(internship._id, companyUser, "rejected", cb); }
              ], function() {
                console.log("      | ---> declined internship");
                done();
              });
            } else {
              next();
            }
          },


          // Pending
          function(next) {
            if (_.random(0, 1) === 0 ) {
              console.log("      | ---> scheduling an interview");
              InternshipService.createInterview(internship._id, companyUser, { date: "2014-06-10", startTime: "12:00 PM", endTime: "01:00 PM" }, function() { next() });
            } else {
              next();
            }
          },
          function(next) {
            if (_.random(0, 1) === 0 ) {
              async.series([
                function(cb) { console.log("      | ---> commenting on internship"); InternshipService.createMessage(internship._id, companyUser, "Hello, when would you be available to come in for an interview?", cb); },
                function(cb) { console.log("      | ---> changing ststus of internship"); InternshipService.createMessage(internship._id, internship.student, "I'll be free all next Monday and Tuesday. Would either of these days be okay?",  cb); }
              ], function() {
                if (scenario === 0 || scenario === 4) {
                  console.log("      | ---> application pending");
                  done();
                } else {
                  next();
                }
              });
            } else {
              if (scenario === 0 || scenario === 4) {
                console.log("      | ---> application pending");
                done();
              } else {
                next();
              }
            }
          },


          // Active
          function(next) {
            async.series([
              function(cb) { InternshipService.changeStatus(internship._id, companyUser, "active", function(err) { if(err) { console.log("        | ---> Error: " + err.message) } cb();}); },
              function(cb) { console.log("      | ---> commenting on internship"); InternshipService.createMessage(internship._id, companyUser, "Welcome to the team. Would you be able to complete your schedule?", function(err) { if(err) { console.log("        | ---> Error: " + err.message) } cb();}); },
              function(cb) { console.log("      | ---> updating the internship schedule"); InternshipService.createSchedule(internship._id, internship.student, { date: "2014-06-12", startTime: "09:00 AM", endTime: "05:00 PM"}, function(err) { if(err) { console.log("        | ---> Error: " + err.message) } cb();}); },
              function(cb) { console.log("      | ---> updating the internship schedule"); InternshipService.createSchedule(internship._id, internship.student, { date: "2014-06-14", startTime: "09:00 AM", endTime: "05:00 PM"}, function(err) { if(err) { console.log("        | ---> Error: " + err.message) } cb();}); },
              function(cb) { console.log("      | ---> updating the internship schedule"); InternshipService.createSchedule(internship._id, internship.student, { date: "2014-06-17", startTime: "09:00 AM", endTime: "03:00 PM"}, function(err) { if(err) { console.log("        | ---> Error: " + err.message) } cb();}); },
              function(cb) { console.log("      | ---> updating the internship schedule"); InternshipService.createSchedule(internship._id, internship.student, { date: "2014-06-21", startTime: "09:00 AM", endTime: "12:00 PM"}, function(err) { if(err) { console.log("        | ---> Error: " + err.message) } cb();}); },
              function(cb) { console.log("      | ---> updating the internship schedule"); InternshipService.createSchedule(internship._id, internship.student, { date: "2014-07-07", startTime: "09:00 AM", endTime: "05:00 PM"}, function(err) { if(err) { console.log("        | ---> Error: " + err.message) } cb();}); },
              function(cb) { console.log("      | ---> commenting on internship"); InternshipService.createMessage(internship._id, internship.student, "I have updated the schedule with my availability for the upcoming two weeks.", function(err) { if(err) { console.log("        | ---> Error: " + err.message) } cb();}); },
              function(cb) { if(_.random(1, 2) === 1) { return cb(); } console.log("      | ---> adding a supervisor"); InternshipService.createSupervisor(internship._id, internship.student, "supervisor-1@internlabs.com.au", function(err) { if(err) { console.log("        | ---> Error: " + err.message) } cb();}); },
              function(cb) { if(_.random(1, 2) === 1) { return cb(); } console.log("      | ---> adding a supervisor"); InternshipService.createSupervisor(internship._id, internship.student, "supervisor-2@internlabs.com.au", function(err) { if(err) { console.log("        | ---> Error: " + err.message) } cb();}); }
            ], function() {
              if (scenario === 1 || scenario === 5) {
                console.log("      | ---> active internship");
                done();
              } else {
                next();
              }
            });
          },

          // Completed
          function(next) {
            async.series([
              function(cb) { InternshipService.changeStatus(internship._id, companyUser, "completed", function() {cb();}); },
              function(cb) { console.log("      | ---> commenting on internship"); InternshipService.createMessage(internship._id, companyUser, "Thank you for completing you internship with us!", function() {cb();}); }
            ], function() {
                console.log("      | ---> completed internship");
                next();
            });
          }

        ], done);
          
      }, callback);

    });

    
  });



  // Run each of the tasks
  async.series(
    tasks
  , function() {
    console.log("  | ---> Done: creating internships");

    if (_.isFunction(callback)) {
      callback(null);
    }
  });

};


module.exports = seed;

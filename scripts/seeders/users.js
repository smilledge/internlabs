/**
 * Seed the users table
 *  - Includes students and companies
 */

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    UserService = require('../../services/user'),
    CompanyService = require('../../services/company'),
    Company = require('../../models/company'),
    request = require('request');


// Raw user data
var data = require('./data/users.json');

var tasks = [];


var seed = function(callback) {

  console.log("+---------------+");
  console.log("| Seeding users |");
  console.log("+---------------+");


  // Delete the existing elasticsearch index
  tasks.push(function(callback) {
    console.log("  | ---> Deleting ElasticSearch Index: ");
    request({
      uri: 'http://127.0.0.1:9200/internlabs',
      method: 'DELETE'
    }, function(err, response, body) {
      console.log("    | ---> Deleted existing documents : " + body);
      callback();
    });
  });


  // Create the import tasks models
  _.each(data, function(user) {
    tasks.push(function(done) {
      UserService.create(user, function(err, user) {
        if (err) {
          console.log("--------------------");
          console.log("Error creating user!");
          console.log("--------------------");
          console.log(err);
          console.log("--------------------");
          done();
        } else {
          // Activate the user
          user.activated = true;
          user.save();

          // Upload logo if company
          if ( _.isObject(user.company) ) {
            Company.findOne(user.company, function(err, company) {
              if (company) {
                CompanyService.setLogo(user, company, __dirname + '/images/' + company.logo, function(err, company) {
                  if (err) {
                    console.log("  | ---> Imported user: " + user.email);
                    console.log("    | ---> ERROR uploading logo: " + err.message);
                    return done();
                  }
                  
                  console.log("  | ---> Imported user: " + user.email);
                  console.log("    | ---> Uploaded logo: " + company.logo);
                  done();
                });
              }
            })
          } else {
            console.log("  | ---> Imported user: " + user.email);
            done();
          }
        }
      });
    });
  });


  // Run each of the tasks
  async.series(
    tasks
  , function() {
    console.log("  | ---> Done: importing users");

    if (_.isFunction(callback)) {
      callback(null);
    }
  });

};


module.exports = seed;

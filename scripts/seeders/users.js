/**
 * Seed the users table
 *  - Includes students and companies
 */

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    UserService = require('../../services/user'),
    CompanyService = require('../../services/company'),
    SearchService = require('../../services/search'),
    Company = require('../../models/company'),
    request = require('request');


// Raw user data
var data = require('./data/users.json'),
    roleData = require('./data/roles.json');

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


      // Recreate the index
      console.log("  | ---> Creating New ElasticSearch Index: ");
      SearchService.company.create(function(err, res) {
        console.log("    | ---> Index created : " + res);
        callback();
      });
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

            console.log("  | ---> Imported user: " + user.email);

            Company.findOne(user.company, function(err, company) {

              async.parallel([
                function(callback) {
                  CompanyService.setLogo(user, company, __dirname + '/images/' + company.logo, function(err, company) {
                    if (err) {
                      console.log("    | ---> ERROR uploading logo: " + err.message);
                      return done();
                    }
                    
                    console.log("    | ---> Uploaded logo: " + company.logo);
                    callback();
                  });
                },

                function(callback) {
                  // Get the role data by company name
                  var roles = roleData[company.name];

                  if (roles) {
                    console.log("    | ---> Adding roles: " + _.pluck(roles, 'title'));

                    async.each(roles, function(role, done) {
                      CompanyService.addRole(company, role, function(err, role) {
                        if (err) {
                          console.log("      | ---> ERROR adding role to company: " + err.message);
                          return done();
                        }
                        
                        console.log("      | ---> Added role to company: " + role.title);
                        done();
                      });
                    }, callback);
                  } else {
                    callback();
                  }
                }

              ], done);

            });


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

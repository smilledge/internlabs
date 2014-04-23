/**
 * Options for searching
 * @type {Object}
 */

var Company = require('./company'),
    _ = require('lodash'),
    async = require('async');

module.exports.get = function(callback) {

    var skills = [];

    async.series([

        function(callback) {
            // Get all roles
            Company.find(null, {skills: 1, _id: 0}).exec(function(err, companies) {
                skills = _.uniq(_.flatten(_.pluck(companies, 'skills')));

                skills.sort(function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
                
                callback();
            });
        }

    ], function() {
        callback(null, {

            types: [
                { key: 'Comapnies', value: 'Comapnies' }, 
                { key: 'Students', value: 'Students' }
            ],

            locations: [
                {
                    group: "Major Cities",
                    children: [
                        "Sydney",
                        "Melbourne",
                        "Brisbane",
                        "Gold Coast",
                        "Perth",
                        "Adelaide",
                        "Hobart",
                        "Darwin",
                        "Canberra"
                    ]
                },
                {
                    group: "Australia Wide",
                    children: [
                        "Australian Capital Territory",
                        "New South Wales",
                        "Northern Territory",
                        "Queensland",
                        "South Australia",
                        "Tasmania",
                        "Victoria",
                        "Western Australia"
                    ]
                }
            ],

            skills: skills

        });
    });

};
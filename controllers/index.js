'use strict';

var _ = require('lodash');


/**
 * Main app
 */
var mainApp = function (req, res) {
  res.render('index.ejs', {
    user: (req.user) ? req.user.toJSON() : null
  });
};


module.exports = function(app) {

    app.get('/', function(req, res, next) {
      // Redirect to dashboard if the user is logged in
      if (req.isAuthenticated()) {
        res.redirect('/dashboard');
      } else {
        next();
      }
    }, function(req, res) {
      res.render('landing-page.ejs');
    });

    // Auth
    app.get('/signup', mainApp);
    app.get('/signup/:type?', mainApp);
    app.get('/login', mainApp);
    app.get('/activate', mainApp);
    app.get('/resend-activation', mainApp);
    app.get('/password-reset', mainApp);
    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });
    

    // Search
    app.get('/search', mainApp);

    // Company Profile
    app.get('/company/:companyId/:slug?', mainApp);

    // Dashboard 
    app.get('/dashboard', mainApp);
    app.get('/dashboard/recommendations', mainApp);
    app.get('/dashboard/internships', mainApp);
    app.get('/dashboard/internships/archived', mainApp);
    app.get('/dashboard/applications', mainApp);
    app.get('/dashboard/applications/declined', mainApp);
    app.get('/dashboard/roles', mainApp);
    app.get('/dashboard/company-profile', mainApp);
    app.get('/dashboard/profile', mainApp);

    // Internships
    app.get('/internship/:internshipId/:slug?', mainApp);
    
};
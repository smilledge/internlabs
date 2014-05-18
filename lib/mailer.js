/**
 * Helper for sending emails
 * =========================
 *
 * Example usage;
 *
 *   mailer.send({
 *     from: "no-reply@example.com" // optional, defaults to the no-reply address set in config
 *     to: "user@example.com",
 *     subject: "Activate your account",
 *     template: "activate.ejs" // Templates are relative to the location set in conf (no leading slash)
 *   }, function(error) { // Done });
 *
 *  (you can also provide a text or html proterty instead of template)
 * 
 */
var nodemailer = require('nodemailer'),
    fs = require('fs'),
    ejs = require('ejs'),
    path = require('path'),
    async = require('async'),
    nconf = require('nconf');

module.exports = function() {

  var transport, noReplyAddress, templatesDir;


  /**
   * Load an email template
   */
  var loadTemplate = function(template, model, callback) {

    // Make sure there's a leading slash
    if ( template.charAt(0) !== '/' ) {
      template = '/' + template;
    }

    // Add the sites url to the model
    model.url = nconf.get('url');
    model.filename = path.join(__dirname, '..', templatesDir, template);

    fs.readFile(model.filename, "utf8", function(err, data) {
      if (err || ! data) {
        return callback(err);
      }

      var content = ejs.render(data, model);
      callback(err, content);
    });
  }


  return {

    /**
     * Set config for the transport and no reply address / tempaltes base directory
     */
    config: function(options) {
      
      if ( options.noReplyAddress ) {
        noReplyAddress = options.noReplyAddress;
        delete options.noReplyAddress;
      }

      if ( options.templatesDir ) {
        templatesDir = options.templatesDir.trim();
        delete options.templatesDir;
      }

      transport = nodemailer.createTransport("SMTP", {
        host: options.host, // hostname
        secureConnection: options.secureConnection, // use SSL
        port: options.port, // port for SMTP
        auth: {
          user: options.username,
          pass: options.password
        }
      });
    },

    /**
     * Send an email
     * 
     * @param  {object}   options  Object with mail options
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    send: function(options, callback) {

      if ( ! transport ) {
        if ( callback ) {
          return callback(new Error("Mailer does not have a configured transport."));
        }
        return;
      }

      if ( ! options.from ) {
        options.from = noReplyAddress;
      }

      async.series([

        // Load the template
        function(next) {
          if (options.template) {
            var template = options.template;
            delete options.template;

            var model = options.model || {};

            loadTemplate(template, model, function(err, template) {
              if (err) {
                return callback(err);
              }

              options.html = template;
              next();
            });
          } else {
            next();
          }
        },

        // Send the email
        function(next) {
          transport.sendMail(options, function(err, response) {
            if ( callback ) {
              callback(err);
            }
          });
        }

      ]);

    },


    close: function() {
      transport.close();
    }

  }
}();
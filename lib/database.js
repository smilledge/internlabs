'use strict';
var mongoose = require('mongoose');


module.exports = {
  config: function (conf) {
    mongoose.connect(conf.host, conf.name, conf.port, {
      user: conf.user,
      pass: conf.pass
    });

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {
      console.log('db connection open');
    });
  }
};
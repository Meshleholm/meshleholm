// dependencies
var express = require('express')
  , app = exports.app = express()
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

// express enviroment/settings
require('./config/express')(app);
// get routes
require('./config/routes')(app);

// listen for connections
var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('(express) Listening on port ' + app.get('port'));
});

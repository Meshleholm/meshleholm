var express = require('express')
  , path = require('path')
  , fs = require('fs')
  , bodyParser = require('body-parser')
  , staticFavicon = require('static-favicon');

module.exports = function(app) {
  
  // engine
  app.engine('jade', require('jade').__express);

  // set
  app.set('port', process.env.PORT || 4040);
  app.set('views', path.join(__dirname, '../app/views'));
  app.set('view engine', 'jade');
  app.set('jsonp callback', true);

  // DISABLE
  app.disable('x-powered-by');

  // USE
  // Because I'm paranoid
  /*app.use(function(req, res, next) {
    res.setHeader('X-Frame-Options', 'sameorigin');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Expires', '-1');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'master-only');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Content-Security-Policy', "default-src 'none'; connect-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; img-src 'self'");
    return next();
  });*/
  app.use(staticFavicon(/*path to favicon*/));
  app.use(bodyParser());
  app.use(express.static(path.join(__dirname, '../public')));
  app.use('/dist', express.static(path.join(__dirname, '../bower_components')));
};

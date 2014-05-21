var cluster = require('cluster')
,   path = require('path')
,   nodestatus = require('../app/utils/nodestatus.js')
,   fs = require('fs')
,   config = require('./config.js')
,   nodemailer = require('nodemailer');

function Routes (app) {

  /*
   * GET
   */
  
  //partials
  app.get('/partials/:view', function(req, res) {
    var view = req.params.view;
    res.render('partials/' + view);
  });

  //api
  app.get('/api/:data', function(req, res) {
    var data = req.params.data;
    switch (data) {
      case 'nodestatus.json':
        nodestatus(function(err, data) {
          if (err) {
            res.json({});
            console.log(err);
          } else {  
            res.json(data);
          }
        });
        break
      default:
        res.json({});
    }
  });

  console.log(config);

  app.post('/api/join', function(req, res) {
    var body = req.body;

    var transport = nodemailer.createTransport("SMTP", {
      service: 'Gmail',
      auth: {
        user: config.development.mail.user,
        pass: config.development.mail.pass
      }
    });

    console.log('SMTP Configured');

    var message = {
      // Edit this later during deployment
      from: 'willeponken@gmail.com <willeponken@gmail.com>',
      to: '"willeponken@gmail.com" <willeponken@gmail.com>',
      subject: '[MESHLEHOLM] New user request',
      html:'<p><b>New user request:<b></p>'
        + '<p>Full name: ' + body.fullname + '</p>'
        + '<p>Email: ' + body.email + '</p>'
        + '<p>Mac address: ' + body.macaddress + '</p>'
        + '<p><b>For copying (tab seperated):</b></p>' + body.fullname + '\t' 
        + body.email + '\t' 
        + body.macaddress
    };

    console.log('Sending Mail');
    transport.sendMail(message, function(error){
      if(error){
        console.log('Error occured');
        console.log(error.message);
        res.send(error.message);
        return;
      }
      console.log('Message sent successfully!');
      res.send('Sent');

      transport.close();
    });

  });

  //catch other req
  app.get('*', function(req, res) {
    res.render('layout/default', {title: 'Meshleholm'});
  });
};  
module.exports = Routes;

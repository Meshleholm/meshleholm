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

  app.post('/api/join', function(req, res) {
    var body = req.body;
    
    function AddRegistration (users) {
        try {
          users = JSON.parse(users);
        } catch (err) {
          console.log(err);
        }
        users.users.push({
          'user': body.fullname,
          'email': body.email,
          'macaddress': body.macaddress,
          'status': 'pending'
        });
        fs.writeFile('./data/reg.json', JSON.stringify(users), function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log('[REG] Successfully registered new user "' + body.fullname + '"');
          }
        });
    };

    fs.readFile('./data/reg.json', 'utf8', function (err, users) {
      if (err && err.code === 'ENOENT') {
        AddRegistration ( { "users": [] } );
      } else if (err) {
        console.log(err);
      } else {
        AddRegistration (users);
      }
    });

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
      from: config.development.mail.from,
      to: config.development.mail.to,
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

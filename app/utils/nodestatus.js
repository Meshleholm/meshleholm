/*jshint loopfunc: true */
'use strict';

var ping = require('net-ping')
,    fs = require('fs')
,   session = ping.createSession ({ networkProtocol: ping.NetworkProtocol.IPv6 });

function pingNodes(nodes, i, callback) {
  session.pingHost (nodes.nodes[i].ipv6, function (error, target, sent, rcvd) {
    var ms = rcvd - sent;
    if (error) {
      console.log (target + ": " + error.toString ());
      nodes.nodes[i].alive = false;
      nodes.nodes[i].delay = ms;
    } else {
      console.log (target + ": Alive (ms=" + ms + ")");
      nodes.nodes[i].alive = true;
      nodes.nodes[i].delay = ms;
    }
    callback(null, nodes);
  });
}

function getNodeStatus(callback) {

  var file = __dirname + '/../../public/data/meshleholm-info/nodes.json';
  
  fs.readFile(file, 'utf8', function (err, nodes) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }
  
    nodes = JSON.parse(nodes);

    var numIterations = 1;
    for (var i = 0; i < nodes.nodes.length; i++) {
      pingNodes(nodes, i, function(err, data) {
        if (err) {
          callback(err);
        } 
        else if (numIterations === nodes.nodes.length) {
          callback(null, nodes);
        } else {
          numIterations++;
        }
      });
    }
  });
}


module.exports = getNodeStatus;

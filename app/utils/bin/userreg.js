#!/usr/bin/env node

/*
  Meshleholm User Registration, for managing users in the Meshleholm network.
  Copyright (C) 2014  William Wennerström.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';
process.title = 'userreg';

// Constants
var REG_PATH = 'data/reg.json';
var ASCII_LOGO = 
  '                  _     _       _           _       \n' +
  '                 | |   | |     | |         | |      \n' +
  ' ____   ____  ___| | _ | | ____| | _   ___ | |____  \n' +
  '|    \\ / _  )/___) || \\| |/ _  ) || \\ / _ \\| |    \\ \n' +
  '| | | ( (/ /|___ | | | | ( (/ /| | | | |_| | | | | |\n' +
  '|_|_|_|\\____|___/|_| |_|_|\\____)_| |_|\\___/|_|_|_|_|\n\n';
var LICENCE_TEXT =
  'Meshleholm User Registration Copyright (C) 2014  William Wennerström\n' +
  'Meshleholm User Registration comes with ABSOLUTELY NO WARRANTY; for details type `warranty`.\n' +
  'This is free software, and you are welcome to redistribute it under certain conditions; type `conditions` for details.\n\n';
var STATUS = {
  err: 'X> ',
  ok: '?> '
};

// Modules
var findup = require('findup-sync'),
    Table = require('cli-table'),
    readline = require('readline'),
    fs = require('fs');

// Create readline insterface
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// We'll need the user requests
try {
  var regpath = findup(REG_PATH);
} catch (err) {
  console.log(err);
}

// Read JSON
function LoadJson(file, callback) {
  if (file) {
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        data = JSON.parse(data);
        callback(null, data);
      }
    });
  } else {
    callback('Error: Invalid path');
  }
}

// Write to JSON
function WriteJson(file, data, callback) {
  fs.writeFile(file, data, 'utf8', function (err) {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
}

// Write out users from JSON
function GetUsers(status, callback) {
  new LoadJson(regpath, function(err, data) {
    if (err) {
      callback(err);
    } else {
      var user;
      var table = new Table({
        head: ['#', 'User', 'Email', 'Mac Address']
      });

      switch(status) {
        case 'not approved':
          for (user = 0; user < data.users.length; user++) {
            if (data.users[user].status !== 'approved') {
              table.push([user, data.users[user].user, data.users[user].email, data.users[user].macaddress]);
            }
          }
          break;
        case 'not denied':
          for (user = 0; user < data.users.length; user++) {
            if (data.users[user].status !== 'denied') {
              table.push([user, data.users[user].user, data.users[user].email, data.users[user].macaddress]);
            }
          }
          break;
        default:
          for (user = 0; user < data.users.length; user++) {
            if (data.users[user].status === status || !status) {
              table.push([user, data.users[user].user, data.users[user].email, data.users[user].macaddress]);
            }
          }
      }
      console.log(table.toString());
      callback();
    }
  });
}

// Change the status of specified user(s)
function ChangeStatus (status, callback) {
  new LoadJson(regpath, function(err, data) {
    if (err) {
      callback(err);
    } else {
      new GetUsers('not ' + status, function(err) {
        if (err) {
          callback(err);
        } else {
          rl.question('Write the users (number) you want to change the status to ' + status + ', space delimited: ', function (input) {
            input = input.split(' ');
            var users = [];
            var table = new Table({
              head: ['#', 'User']
            });

            for (var i = 0; i < input.length; i++) {
              if (data.users[input[i]] && data.users[input[i]].status !== status) {
                users.push(input[i]);
              }
            }
            if (users.length === 0) {
              callback('No valid users specified, aborting...\n');
            } else {
              console.log('This is the users that will be changed to the status ' + status + ':\n');
              for (i = 0; i < users.length; i++) {
                table.push([users[i], data.users[users[i]].user]);
              }
              console.log(table.toString());
              rl.question('Is this right? [Yes/No] ', function (input) {
                if (input.toLowerCase() === 'yes' || input.toLowerCase() === 'y') {
                  for (var i = 0; i < users.length; i++) {
                    data.users[users[i]].status = status;
                  }
                  new WriteJson(regpath, JSON.stringify(data), function(err) {
                    if (err) {
                      callback('Failed to write to ' + regpath + ' (' + err + ')\n');
                    } else {
                      console.log('Successfully updated status!\n');
                    }
                    callback();
                  });
                } else {
                  console.log('Aborting...\n');
                  callback();
                }
              });
            }
          });
          callback();
        }
      });
    }
  });
}

// Command prompt switch
function CommandSwitch(cmd, callback) {
  switch(cmd.trim()) {
    case 'requests':
      new GetUsers('pending', function(err) {
        if(err) {
          console.log(err);
          callback('err');
        } else {
        callback();
        }
      });
      break;
    case 'approved':
      new GetUsers('approved', function(err) {
        if(err) {
          console.log(err);
          callback('err');
        } else {
        callback();
        }
      });
      break;
    case 'denied':
      new GetUsers('denied', function(err) {
        if(err) {
          console.log(err);
          callback('err');
        } else {
        callback();
        }
      });
      break;
    case 'all':
      new GetUsers(null, function(err) {
        if(err) {
          console.log(err);
          callback('err');
        } else {
        callback();
        }
      });
      break;
    case 'approve':
      new ChangeStatus('approved', function (err) {
        if (err) {
          console.log(err);
          callback('err');
        } else {
          callback();
        }
      });
      break;
    case 'deny':
      new ChangeStatus('denied', function (err) {
        if (err) {
          console.log(err);
          callback('err');
        } else {
          callback();
        }
      });
      break;
    case 'warranty':
      console.log('"THE LICENCE"\n');
      callback();
      break;
    case 'conditions':
      console.log('"CONDITIONS"\n');
      callback();
      break;
    case 'help':
      console.log('Available commands:\n' +
          ' requests - List all requests\n' +
          ' approved - List all approved users\n' +
          ' denied - List all denied users\n' +
          ' all - List all users\n' +
          ' approve - Approve users\n' +
          ' deny - Deny users\n' +
          ' warranty - Show the warranty for using this software\n' +
          ' conditions - Show the licence conditions\n' +
          ' help - Show this message\n' +
          ' exit - Exit Meshleholm User Registration\n');
      callback();
      break;
    case 'exit':
      console.log('Good bye.\n');
      rl.close();
      process.exit();
      break;
    default:
      console.log(cmd + ': command not found\n');
      callback('err');
  }
}

// Return command prompt style, based on status
function CommandStatus(status, callback) {
  if(status === 'err') {
    callback(STATUS.err);
  } else {
    callback(STATUS.ok);
  }
}

// The command prompt
function CommandPrompt(status) {
  new CommandStatus(status, function(status) {
    rl.question(status, function (input) {
      new CommandSwitch(input, function(status) {
        new CommandPrompt(status);
      });
    });
  });
}

// Clear TTY
process.stdout.write('\u001B[2J\u001B[0;0f');
console.log(ASCII_LOGO + LICENCE_TEXT);
// Call command prompt
new CommandPrompt();

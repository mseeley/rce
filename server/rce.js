#!/usr/bin/env node

// FIXME: Replace a lot of this silliness with Socket.io.

// -----------------------------------------------------------------------------

var commands = [];
var pending;

// -----------------------------------------------------------------------------

// Load the http module to create an http server.
var http = require('http');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Max-Age', '86400');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept');

  // // set up some routes
  // switch(req.url) {
  //   case '/':
  //     break;
  //   default:
  //    // 4040

  switch (request.method) {
    case 'GET':
      var command = commands.shift();

      if (command) {
        console.info('>', command.text);

        command = JSON.stringify(command);

        response.statusCode = 200;
        response.setHeader('Content-Length', command.length);
        response.setHeader('Content-Type', 'application/json;charset=UTF-8');

        response.write(command);
      } else {
        response.statusCode = 204;
      }

      response.end();

      break;
    case 'POST':
      var data = '';
      request.on('data', function (chunk) {
        data += chunk.toString();
      });

      request.on('end', function () {
        var result = JSON.parse(data);
        console.log('<', result.command.text, '=', result.result);
        response.statusCode = 200;
        response.end();
      });

      break;
    default :
      response.statusCode = 200;
      response.end();
  }

});

// FIXME: Accept port number on cli
var port = 8001;
server.listen(port);

// http://stackoverflow.com/questions/10750303/how-can-i-get-the-local-ip-address-in-node-js
var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
var k, k2;
for (k in interfaces) {
    for (k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log('Server running at http://%s:%d/', addresses[0], port);

// -----------------------------------------------------------------------------

function Command (cmd) {
  this.id = ++Command.n;
  this.text = cmd;
}
Command.prototype.toString = function () {
  return this.text;
};
Command.n = 0;

process.stdin.resume();
process.stdin.setEncoding('utf8');

var util = require('util');

process.stdin.on('data', function (text) {
  text = text.trim();
  if (text) {
    commands.push(new Command(text));
  }
});

// -----------------------------------------------------------------------------
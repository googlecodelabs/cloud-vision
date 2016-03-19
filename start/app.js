/*
   Copyright 2016, Google, Inc.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

'use strict';

var adaro = require('adaro');
var express = require('express');
var path = require('path');

// Setup modules and dependencies
var config = require('./config');

var app = express();

// Set view template engine
app.engine('dust', adaro.dust());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');
app.use(express.static(path.join(__dirname, 'public')));

// Configure routes
app.use('/', require('./lib/routes')());

// Basic 404 handler
app.use(function(req, res) {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use(function(err, req, res, next) {
  console.error(err);

  // Send response if exists, if not send a custom message
  res.status(500).send(err.response || 'Server failed!');
});

// Start the server
var server = app.listen(process.env.PORT || 8080, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

module.exports = app;

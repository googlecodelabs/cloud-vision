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

var assign = require('lodash').assign;
var express = require('express');
var router = express.Router();
var values = require('lodash').values;

var routes = function(storageClient, cloudVisionClient) {
  var defaultContext = {
    featureTypes: values(cloudVisionClient.featureTypes)
  };

  router.get('/', function(req, res) {
    res.render('base', defaultContext);
  });

  router.post('/', 
    storageClient.multer.single('image'),
    storageClient.uploadToStorage,
    function(req, res) {
      var context = {
        vision: {}
      };

      if (req.file && req.file.cloudStoragePublicUrl) {
        cloudVisionClient.detectImage(
          req.file.cloudStorageUri, 
          req.body.imageType, 
          req.body.maxResults,
          function(error, response) {
            if (error) {
              context.error = error;
            } else {
              // Indent 2 spaces the json response if exists.
              context.vision.prettyprint = response ? 
                  JSON.stringify(response, null, 2) : null;
              context.vision.imageUrl = req.file.cloudStoragePublicUrl;
              context.vision.response = JSON.stringify(response.responses);
            }

            res.render('base', assign(context, defaultContext));
          }
        );        
      } else {
        context.error = 'Something went wrong uploading the image!';
        res.render('base', assign(context, defaultContext));
      }
  });

  return router;
};

module.exports = routes;

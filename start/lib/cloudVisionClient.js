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

var unirest = require('unirest');
var invert = require('lodash').invert;

function VisionClient(config) {
  if (!(this instanceof VisionClient)) {
    return new VisionClient(config);
  }
 
  this.key = config.key;
  this.FEATURE_TYPES = VisionClient.FEATURE_TYPES;
};

/**
 * Google Cloud Vision images service endpoint.
 * @private
 */
VisionClient.GOOGLE_VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

/**
 * Types of image detection task to perform on images.
 * @private
 */
VisionClient.FEATURE_TYPES = {
  LABEL_DETECTION: 'Execute Image Content Analysis on the entire image and return',
  TEXT_DETECTION: 'Perform Optical Character Recognition (OCR) on text within the image',
  FACE_DETECTION: 'Detect faces within the image',
  LANDMARK_DETECTION: 'Detect geographic landmarks within the image',
  LOGO_DETECTION: 'Detect company logos within the image',
  SAFE_SEARCH_DETECTION: 'Determine image safe search properties on the image',
  IMAGE_PROPERTIES: 'Compute a set of properties about the ' +
    'image (such as the image\'s dominant colors)'
};

VisionClient.prototype.featureTypes = VisionClient.FEATURE_TYPES;

/**
 * Calls the cloud vision endpoint to run image
 * detection and annotation for an image.
 *
 * @param {string} cloudStorageUri - Cloud Storage Image File Uri.
 * @param {string} featureType - Type of image detection task to perform.
 * @param {number} maxResults - Maximum number of results to expect of the feature type.
 * @param {Function} callback The callback.
 */
VisionClient.prototype.detectImage = function(cloudStorageUri, featureType, maxResults, callback) {
  var body = {
    requests: [
      {
        image: {
          source: {
            gcsImageUri: cloudStorageUri,
          }
        },
        features: [
          {
            type: invert(this.featureTypes)[featureType] ||
              featureType.TYPE_UNSPECIFIED,
            maxResults: maxResults
          }
        ]
      }
    ]
  };

  unirest.post(VisionClient.GOOGLE_VISION_API_URL + '?key=' + this.key)
    .header({ 'Content-Type': 'application/json' })
    .send(body)
    .end(function (response) {
      callback(response.error, response.body);
    });
};

module.exports = VisionClient;

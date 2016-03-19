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

var clientId = 'your-client-id';
var clientSecret = 'your-client-secret';
var redirectUrl = 'http://localhost:8080/oauth2callback';

var projectId = 'your-project-id';
var bucketName = 'your-bucket-name';

var credentialsApiKey = 'your-credentials-api-key';

module.exports = {
  port: process.env.PORT || 8080,

  // Secret is used by sessions to encrypt the cookie.
  secret: process.env.SESSION_SECRET || 'your-secret-here',

  // The client ID and secret can be obtained by generating a new web
  // application client ID on Google Developers Console.
  oauth2: {
    clientId: process.env.OAUTH_CLIENT_ID || clientId,
    clientSecret: process.env.OAUTH_CLIENT_SECRET || clientSecret,
    redirectUrl: process.env.OAUTH2_CALLBACK || redirectUrl,
    scopes: ['email', 'profile']
  },

  // Google Developers Console Project Id.
  gcloud: {
    projectId: process.env.GCLOUD_PROJECT || projectId
  },

  gcloudStorageBucket: process.env.CLOUD_BUCKET || bucketName,
  dataBackend: 'datastore',

  gcloudVision: {
    key: process.env.CLOUD_VISION_KEY || credentialsApiKey
  }
};

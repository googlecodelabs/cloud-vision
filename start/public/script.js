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

function initCanvas(imgUrl, response) {
  var canvas = document.getElementById('panel-canvas');
  var panelBody = document.getElementById('panel-body');
  var context = canvas.getContext('2d');
  var imgObj = new Image();

  context.canvas.width  = panelBody.offsetWidth - 100;
  context.canvas.height = panelBody.offsetHeight;
  
  imgObj.onload = function() {
    var hRatio = context.canvas.width / imgObj.width;
    var vRatio = context.canvas.height / imgObj.height;
    var ratio  = Math.min(hRatio, vRatio);

    var scaledImageWidth = imgObj.width * ratio;
    var scaledImageHeight = imgObj.height * ratio;
    var centerShiftX = (canvas.width - scaledImageWidth) / 2;
    var centerShiftY = (canvas.height - scaledImageHeight) / 2;  

    context.scale = {
      centerShiftX: centerShiftX,
      centerShiftY: centerShiftY,
      imageWidth: scaledImageWidth,
      imageHeight: scaledImageHeight
    };

    context.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height,
                      centerShiftX, centerShiftY, scaledImageWidth, scaledImageHeight);

    drawOutput(JSON.parse(response), this, context);
  };

  imgObj.src = imgUrl;
}

function drawOutput(responses, imgObj, context) {
  for (var i = 0; i < responses.length; i++) {
    var response = responses[i];
    if (response.faceAnnotations) {
      drawFace(response.faceAnnotations, imgObj, context);
    }
  }
}

function drawFace(faceAnnotations, imgObj, context) {
  for (var i = 0; i < faceAnnotations.length; i++) {
    var annotation = faceAnnotations[i];

    drawRectangle(annotation.boundingPoly.vertices, imgObj, context);

    // Part that encloses only the skin part of the face
    drawRectangle(annotation.fdBoundingPoly.vertices, imgObj, context);

    drawCircles(annotation.landmarks, imgObj, context);
  }
}

function drawCircles(landmarks, imgObj, context) {
  var radius = 3;

  for (var i = 0; i < landmarks.length; i++) {
    var landmark = landmarks[i];
    var x = scaleX(landmark.position.x, imgObj, context);
    var y = scaleY(landmark.position.y, imgObj, context);

    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.lineWidth = 0.5;
    context.strokeStyle = 'red';
    context.stroke();
  }
}

function drawRectangle(vertices, imgObj, context) {
  var v1 = getMinVertice(vertices);
  var v2 = getMaxVertice(vertices);
  var topLeft = { 
    x: scaleX(v1.x, imgObj, context), 
    y: scaleY(v1.y, imgObj, context) 
  };
  var bottomRight = {
    x: scaleX(v2.x, imgObj, context),
    y: scaleY(v2.y, imgObj, context)
  };

  context.beginPath();
  context.lineWidth = 1;
  context.strokeStyle = 'red';
  context.rect(
    topLeft.x,
    topLeft.y, 
    bottomRight.x - topLeft.x,
    bottomRight.y - topLeft.y
  ); 
  context.stroke();
}

function getMaxVertice(vertices) {
  return vertices.reduce(function(prev, curr) {
    prev.x = isNaN(prev.x) ? -Infinity : prev.x;
    prev.y = isNaN(prev.y) ? -Infinity : prev.y;
    curr.x = isNaN(curr.x) ? -Infinity : curr.x;
    curr.y = isNaN(curr.y) ? -Infinity : curr.y;

    return (prev.x >= curr.x) && (prev.y >= curr.y) ? prev : curr;
  });
}

function getMinVertice(vertices) {
  return vertices.reduce(function(prev, curr) {
    prev.x = isNaN(prev.x) ? Infinity : prev.x;
    prev.y = isNaN(prev.y) ? Infinity : prev.y;
    curr.x = isNaN(curr.x) ? Infinity : curr.x;
    curr.y = isNaN(curr.y) ? Infinity : curr.y;

    return (prev.x <= curr.x) && (prev.y <= curr.y) ? prev : curr;
  });
}

function scaleX(x, imgObj, context) {
  return ((context.scale.imageWidth * x) / imgObj.width) + context.scale.centerShiftX;
}

function scaleY(y, imgObj, context) {
  return ((context.scale.imageHeight * y) / imgObj.height) + context.scale.centerShiftY;
}

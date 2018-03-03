'use strict';

const AWS = require('aws-sdk');
const AwsConfig = require('./config').aws
AWS.config.update(AwsConfig);

const s3 = new AWS.S3();

module.exports.routeRequest = function (request, context, callback) {
  // return callback(null, request);

  if (request.httpMethod == 'PUT') {
    const body = JSON.parse(request.body);

    return putObjectToS3(body, callback)
      .then(data => {
        formatResponseForApi(null, data, callback);
      })
      .catch(err => {
        const error = new Error(err);
        formatResponseForApi(error, null, callback);
      });
  } else if (request.httpMethod == 'GET') {
    const body = request.queryStringParameters
    return getTeamsFromS3(body, callback)
      .then(data => {
        formatResponseForApi(null, data, callback);
      })
      .catch(err => {
        const error = new Error(err);
        formatResponseForApi(error, null, callback);
      });
  } else {
    const error = new Error("Error: invalid Route.");
    formatResponseForApi(error, null, callback);
  }
}

function formatResponseForApi(error, message, callback) {
  const response = {
    "statusCode": 200,
    "body": JSON.stringify(message),
    "isBase64Encoded": false
  };

  if (error) {
    response.statusCode = 500;
  }

  callback(error, response);
}

function getTeamsFromS3(body, callback) {
  const password = getPasswordHash(body.password);
  const prefix   = body.username + "/" + password;
  // return callback(null, "pokemonshowdown" + body.username + "/" + password);
  return s3
    .listObjects({
      Bucket: "pokemonshowdown",
      Prefix: prefix,
    }).promise()
    .then(data => {
      const teams = [];

      for (let object of data['Contents']) {
        const teamName = object['Key'].replace(prefix + '/' ,'');
        teams.push(teamName);
      }

      return teams;
    });
}

function putObjectToS3(body) {
  const password = getPasswordHash(body.password);

  return s3.putObject({
    Bucket: 'pokemonshowdown',
    Key: body.username + "/" + password + "/" + body.team,
    Body: body.data
  }).promise();
}

function getPasswordHash(password) {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256');

  hash.setEncoding('hex');
  hash.write(password);
  hash.end();

  const hashedPassword = hash.read();
  return hashedPassword;
}
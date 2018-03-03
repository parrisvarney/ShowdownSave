'use strict';

const AWS          = require('aws-sdk');
const ApiInterface = require('./api-interface');
const AwsConfig    = require('./config').aws

AWS.config.update(AwsConfig);

module.exports.routeRequest = function (request, context, callback) {
  switch(true) {
    case request.httpMethod == 'PUT': 
      return ApiInterface.formatForApi(
        JSON.parse(request.body), 
        putObjectToS3, 
        callback);
    case request.httpMethod == 'GET' && request.path == '/teams' :
      return ApiInterface.formatForApi(
        request.queryStringParameters, 
        getTeamsFromS3, 
        callback);
    case request.httpMethod == 'GET' && request.path == '/team' :
      return ApiInterface.formatForApi(
        request.queryStringParameters, 
        getTeamDataFromS3, 
        callback);
  }
}

function getTeamsFromS3(body) {
  const s3       = new AWS.S3();
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

function getTeamDataFromS3(body) {
  const s3       = new AWS.S3();
  const password = getPasswordHash(body.password);
  const key      = `${body.username}/${password}/${body.team}`;
  
  return s3
    .getObject({
      Bucket: "pokemonshowdown",
      Key:    key,
    }).promise()
    .then(data => {
      return data['Body'].toString('utf-8');
    });
}

function putObjectToS3(body) {
  const s3       = new AWS.S3();
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
'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = require('../schemas/book.schema');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body);
    data.id = uuid.v1();

  let valid = ajv.validate(schema, data);

  if(valid) {
    let response = {};

    const timestamp = new Date().getTime();
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: data.id,
        title: data.title,
        authors: data.authors,
        stage: data.stage,
        editor: data.editor,
        pcp: data.pcp,
        createdAt: timestamp,
        updatedAt: timestamp
      },
    };

    dynamoDb.put(params, (error) => {
      if (error) {
        response = {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'There was an error adding new article insight to the DB. Try again later. ' + error,
        };

      } else {

        response = {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(params.Item),
        };
      }
      callback(null, response);
    });


  } else {
    callback(null, {
      statusCode: 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Invalid data. ' + ajv.errorsText(),
    });
  }

};

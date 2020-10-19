'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = require('../schemas/book.schema');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  let valid = ajv.validate(schema, data);

  if(valid) {

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        'id': data.id,
      },
      ExpressionAttributeNames: {
        '#title': 'title',
        '#authors': 'authors',
        '#stage': 'stage',
        '#editor': 'editor',
        '#pcp': 'pcp',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':title': data.title,
        ':authors': data.authors,
        ':stage': data.stage,
        ':editor': data.editor,
        ':pcp': data.pcp,
        ':updatedAt': timestamp
      },
      UpdateExpression: 'set #title = :title, #authors = :authors, #stage = :stage, #editor = :editor, #pcp = :pcp, #updatedAt = :updatedAt',
      ReturnValues: 'NONE'
    };

    dynamoDb.update(params, (error, success) => {
      if (error) {
        console.log('ERROR: id', data.id);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: `There was an error Updating the item.
            Id: ${data.id}.
            Message: ${JSON.stringify(error, null, 2)}`,
        });
        return;
      }

      const response = {
        statusCode: 200,
  	    headers: {
          "Content-Type": "application/json",
  	      'Access-Control-Allow-Origin': '*'
  	    },
        body: JSON.stringify({success: true}),
      };

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

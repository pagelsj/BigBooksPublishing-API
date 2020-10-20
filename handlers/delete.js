'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
let response = { };

module.exports.delete = (event, context, callback) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };


  dynamoDb.delete(params, (error, result) => {
    // handle potential errors
    if (error) {
      response = {
        statusCode: error.statusCode || 501,
        headers: {
          'Content-Type': 'text/plain'
        },
        body: `There was an error deleting the item.
          Message: ${JSON.stringify(error, null, 2)}`
      };
    } else {

      // create a response
      response = {
        "statusCode": 200,
        "headers": {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        "body": JSON.stringify(result),
      };
    }


    callback(null, response);
  });
};

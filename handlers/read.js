'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.read = (event, context, callback) => {
  // const params = JSON.parse(event.pathParameters);
  // console.log('params', params);
  let response = {};

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    // Key: {
    //   title: event.pathParameters.title
    // }
    // IndexName: 'titleIndex',
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames: {
      '#id': 'id'
    },
    ExpressionAttributeValues: {
      ':id' : decodeURI(event.pathParameters.id)
    }
  };

  // fetch todo from the database
  dynamoDb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      response = {
        statusCode: error.statusCode || 501,
        headers: {
          'Content-Type': 'text/plain'
        },
        body: 'Couldn\'t fetch the article item.',
      };

    } else {

      // create a response
      response = {
        "statusCode": 200,
        "headers": {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        "body": JSON.stringify(result.Items),
      };
    }
    callback(null, response);

  });
};

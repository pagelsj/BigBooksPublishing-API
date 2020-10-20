# Big Books Publishing Co: API

The Big Books Publishing Co API was built using ServerlessJS and is to be deployed to AWS. This can be done via the Serverless Dashboard or via the terminal on your local machine.
It makes use of AWS' Lambda, DynamoDB and API Gateway.

## Building and deploying

### Requirements
In order to build the project you will need NodeJS and NPM running on your local machine. In order to deploy, you will need an AWS account and the AWS access credentials on your local machine. Instructions to do this can be found at, [https://www.serverless.com/framework/docs/providers/aws/guide/credentials/](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/).

### Install and deploy steps

 1. Clone the repository using git-cli.

    `git clone git@github.com:pagelsj/BigBooksPublishing-API.git`
2. Install all the needed packages using npm, or yarn.

    `npm install` or `yarn install`
3. The project and all dependencies will now be installed and ready to deploy.

    `sls deploy` or `sls deploy --aws-profile [aws profile name]`

## Available endpoints

I currently have the API deployed on my own personal AWS account that you can access via the following URLs:

### Create
**Method**: `POST`

**URL**: `https://bwvlcy83p1.execute-api.eu-west-2.amazonaws.com/dev/book-state`

**Payload**:
``` JSON
{
  "title": "Peter Pan - The Biography",
  "authors": ["Wendy", "Peter"],
  "stage":"Received",
  "editor":"Peter Pan",
  "pcp":"Wendy"
}
```
___
### Update
**Method**: `PUT`

**URL**: `https://bwvlcy83p1.execute-api.eu-west-2.amazonaws.com/dev/book-state`

**Payload**:
``` JSON
{
  "id": "UUID generated when record is created",
  "title": "Peter Pan - The untold story",
  "authors": ["Wendy", "Peter"],
  "stage":"Typeset",
  "editor":"Peter Pan",
  "pcp":"Wendy"
}
````
___
### Get

**Method**: `GET`

**URL**: `https://bwvlcy83p1.execute-api.eu-west-2.amazonaws.com/dev/book-state/{id}`

**Return Payload**: _Only the record that is found matching that one ID_

``` JSON
{
  "id": "xxxx-xxxx-xxxx-xxxx",
  "title": "Peter Pan - The untold story",
  "authors": ["Wendy", "Peter"],
  "stage":"Typeset",
  "editor":"Peter Pan",
  "pcp":"Wendy"
}
````

___
### Get All

**Method**: `GET`

**URL**: `https://bwvlcy83p1.execute-api.eu-west-2.amazonaws.com/dev/book-state`

**Return Payload**: An array of all recorders

___
### Delete

**Method**: `DELETE`

**URL**: `https://bwvlcy83p1.execute-api.eu-west-2.amazonaws.com/dev/book-state/{id}`

**Return Payload**: `{success: true}`

## Assumptions
The API needed to be:
1. Maintainable
2. Loosely coupled from other (future) API's
3. Easy to identify errors
4. Performant
5. Cost effective
6. Easy to secure

## Interesting parts
1. UUID is created for each new record.
2. Records can only be manipulated via their unique ID - less chance of wrong records being changed.
3. API data is compressed with Gzip.

## Improvements
1. If I had time, I would have made the code reusable.

  > _Eg_:
  > I would have extracted the JSON schema validation code into a reusable method that would have taken the Schema name and data as parameters and tested the data, with a generic error callback if validation failed._

2. I would certainly added unit tests!
3. Dynamically built the `UpdateExpression` in the Update Endpoint.
4. Added functionality to update multiple records at once.
5. I would consider creating a table for the editors/authors and stored their ID's to the table rather. (Allows for more data if needed moving forward)

# Northcoders News Back-End

A back-end server built to interface with a mongoDB database - providing useful api endpoints which allow a user to WRITE, READ and DELETE articles as well as filtering them by TOPIC and allowing them to both COMMENT ON and VOTE ON chosen articles.

## Take a look -->

https://hannahs-nc-news.herokuapp.com/api/articles

## EndPoints

Here is a list of endpoints available GET /api Serves information about the following endpoints-

### GET

/api/topics Returns all the topics

### GET

/api/topics/:topic_id/articles Get all the articles for a specific topic

### POST

/api/topics/:topic_id/articles Add a new article to a topic. This route requires a JSON body with title and body key value pairs e.g: { "title": "this is my new article title" "body": "This is my new article content" }

### GET

/api/articles Returns all the articles

### GET

/api/articles/:article_id Returns an individual article using its ID

### GET

/api/articles/:article_id/comments Returns all the comments for a individual article

### POST

/api/articles/:article_id/comments Add a new comment to an article. This route requires a JSON body with a comment key and value pair e.g: {"comment": "This is my new comment"}

### PATCH

/api/articles/:article_id Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down' e.g: /api/articles/:article_id?vote=up

### PATCH

/api/comments/:comment_id Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down' e.g: /api/comments/:comment_id?vote=down

### DELETE

/api/comments/:comment_id Deletes a comment

### GET

/api/users/:username Returns a JSON object with the profile data for the specified user.

## Built With

EXPRESS - Fast, unopinionated, minimalist web framework for node.
MONGOOSE - Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
BODY-PARSER - Node.js body parsing middleware.

Downloading For External Use The 4 production dependencies are listed above however there are also 4 recommended development dependencies that will help with the testing included and further development.

## Testing

CHAI- Chai is a BDD / TDD assertion library for node and the browser.
MOCHA - Simple, flexible, fun JavaScript test framework for Node.js & The Browser.
NODEMON - nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application. SUPERTEST - HTTP assertions made easy via superagent.

## Extra Information

Not included in this repository are the development/test/production files in the config folder that export (through an index file) a string that is a link to the mongo database e.g. "mongodb://:@mlab:port/".

The seed file provided should create an appropriate local mongo database. This can be ran using 'npm seed:dev'

Testing Code Additions The provided tests (ran through the 'npm test' script) are set up to test all of the existing server endpoints and correct/incorrect usage of them by users. Any tests written for additional endpoints created should follow the same structure.

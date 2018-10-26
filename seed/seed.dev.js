const seedDB = require("./seed");
const mongoose = require("mongoose");
const { DB_URL } = require("../config");
const topicData = require("./devData/topics.json");
const userData = require("./devData/users.json");
const articleData = require("./devData/articles.json");
const commentData = require("./devData/comments.json");

mongoose
  .connect(DB_URL)
  .then(() => seedDB({ topicData, userData, articleData, commentData }))
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(console.log);

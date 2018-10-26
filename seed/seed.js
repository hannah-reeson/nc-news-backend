const mongoose = require("mongoose");
const { formatArticles, formatComments } = require("../utilities");
const { Topic, User, Article, Comment } = require("../models");

const seedDB = ({ topicData, userData, articleData, commentData }) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      const topicDocs = Topic.insertMany(topicData);
      const userDocs = User.insertMany(userData);
      return Promise.all([topicDocs, userDocs]);
    })
    .then(([topicDocs, userDocs]) => {
      const articles = formatArticles(articleData, userDocs);
      const articleDocs = Article.insertMany(articles);
      return Promise.all([articleDocs, topicDocs, userDocs]);
    })
    .then(([articleDocs, topicDocs, userDocs]) => {
      const comments = formatComments(commentData, userDocs, articleDocs);
      const commentDocs = Comment.insertMany(comments);
      return Promise.all([articleDocs, topicDocs, userDocs, commentDocs]);
    });
};

module.exports = seedDB;

const topicRouter = require("express").Router();
const {
  getTopics,
  getArticleByTopic,
  addArticleByTopic
} = require("../controllers/topics");

topicRouter.route("/").get(getTopics);

topicRouter
  .route("/:topic_slug/articles")
  .get(getArticleByTopic)
  .post(addArticleByTopic);

module.exports = topicRouter;

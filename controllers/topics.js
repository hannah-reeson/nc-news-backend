const { Topic, Article } = require("../models/index");

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const getArticleByTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  Article.find({ belongs_to: topic_slug })
    .populate("created_by")
    .then(articles => {
      if (!articles.length) throw { msg: "Invalid Topic", status: 400 };
      res.status(200).send({ articles });
    })
    .catch(next);
};

const addArticleByTopic = (req, res, next) => {
  const newArticle = req.body;
  Article.create(newArticle)
    .then(newArticle => {
      res.status(201).send(newArticle);
    })
    .catch(next);
};

module.exports = { getTopics, getArticleByTopic, addArticleByTopic };

const { Article, Comment } = require("../models");
const { commentCount } = require("../utilities");

const getArticles = (req, res, next) => {
  Article.find()
    .populate("created_by")
    .lean()
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  Article.findById(article_id)

    .populate("created_by")
    .lean()
    .then(article => {
      if (!article) throw { msg: "Article Not Found", status: 404 };
      return commentCount(article);
    })
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const getCommentByArticle = (req, res, next) => {
  const { article_id } = req.params;
  Article.findById(article_id)
    .populate("created_by")
    .populate("belongs_to")
    .lean();
  Comment.find({ belongs_to: article_id })
    .then(([article, comments]) => {
      if (!article) throw { msg: "Invalid article ID", status: 400 };
      res.status(200).send({ comments });
    })
    .catch(next);
};

const addCommentByArticle = (req, res, next) => {
  const newComment = req.body;
  Comment.create(newComment)
    .then(newComment => {
      return Comment.findById(newComment._id)
        .populate("created_by")
        .populate("belongs_to");
    })
    .then(newComment => {
      res.status(201).send(newComment);
    })
    .catch(next);
};
const changeVotesOfArticle = (req, res, next) => {
  const { article_id } = req.params;
  const votes =
    req.query.vote == "up"
      ? 1
      : req.query.vote == "down"
        ? -1
        : Math.floor(Math.random() * 10);
  Article.findByIdAndUpdate(
    article_id,
    { $inc: { votes: votes } },
    { new: true }
  )
    .populate("created_by")
    .lean()
    .then(article => {
      if (!article) throw { status: 404, msg: "Article Not Found" };
      res.status(200).send({ article });
    })
    .catch(next);
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentByArticle,
  addCommentByArticle,
  changeVotesOfArticle
};

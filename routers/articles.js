const articleRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentByArticle,
  addCommentByArticle,
  changeVotesOfArticle
} = require("../controllers/articles");

articleRouter.route("/").get(getArticles);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(changeVotesOfArticle);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentByArticle)
  .post(addCommentByArticle);

module.exports = articleRouter;

const commentRouter = require("express").Router();
const {
  changeVotesOfComment,
  deleteComment
} = require("../controllers/comments");

commentRouter
  .route("/:comment_id")
  .patch(changeVotesOfComment)
  .delete(deleteComment);

module.exports = commentRouter;

const { Comment } = require("../models");

const changeVotesOfComment = (req, res, next) => {
  const { comment_id } = req.params;
  const votes = req.query.vote == "up" ? 1 : req.query.vote == "down" ? -1 : 0;
  Comment.findByIdAndUpdate(
    comment_id,
    { $inc: { votes: votes } },
    { new: true }
  )
    .then(comment => {
      if (!comment) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      } else {
        res.status(200).send({ comment });
      }
    })

    .catch(next);
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove({ _id: comment_id })
    .then(() => {
      res.status(200).send({ msg: "A Comment Was Sucessfully Deleted!" });
    })
    .catch(next);
};

module.exports = { changeVotesOfComment, deleteComment };

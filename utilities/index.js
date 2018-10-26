exports.formatArticles = (articleData, userDocs) => {
  return articleData.map(article => ({
    ...article,
    belongs_to: article.topic,
    created_by: userDocs.find(user => article.created_by === user.username)._id
  }));
};

exports.formatComments = (commentData, userDocs, articleDocs) => {
  return commentData.map(comment => ({
    ...comment,
    created_by: userDocs.find(user => comment.created_by === user.username)._id,
    belongs_to: articleDocs.find(
      article => comment.belongs_to === article.title
    )._id
  }));
};

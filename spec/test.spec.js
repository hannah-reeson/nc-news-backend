process.env.NODE_ENV = "test";
const { expect } = require("chai");
const mongoose = require("mongoose");
const app = require("../app");
const request = require("supertest")(app);
const seedDB = require("../seed/seed");
const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../seed/testData");

describe("/api", () => {
  let topicDocs, articleDocs, commentDocs, userDocs;
  beforeEach(() => {
    return seedDB({
      topicData,
      articleData,
      commentData,
      userData
    }).then(docs => {
      articleDocs = docs[0];
      topicDocs = docs[1];
      userDocs = docs[2];
      commentDocs = docs[3];
    });
  });

  after(() => {
    return mongoose.disconnect();
  });
  describe("/topics", () => {
    it("GET returns a status 200 and an array of topics", () => {
      return request
        .get("/api/topics/")
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an("array");
          expect(res.body.topics.length).to.equal(2);
          expect(res.body.topics[0]).to.include.keys("_id", "title", "slug");
        });
    });
    it("GET returns a status 200 and returns an array of articles by a topic slug", () => {
      return request
        .get("/api/topics/cats/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("array");
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0]).to.include.keys("_id", "votes", "title");
        });
    });
    it("GET returns a status 400 when given an invalid topic slug", () => {
      return request
        .get("/api/topics/unicorns/articles")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid Topic");
        });
    });
    it("POST returns a status 201 and adds an article by a topic slug", () => {
      return request
        .post("/api/topics/mitch/articles")
        .send({
          title: "test article",
          body: "this is a test article",
          created_by: "5bd2ed8e6309881b3ef8a89c"
        })
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("_id");
          expect(res.body.title).to.equal("test article");
        });
    });
    it("POST returns a 400 status with an error when trying to add an empty article", () => {
      return request
        .post("/api/topics/cats/articles")
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad Request");
        });
    });
  });
  describe("/articles", () => {
    it("GET returns a status 200 and an array of articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("array");
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[0]).to.have.property("title");
        });
    });
    it("GET returns a status 200 and returns an articles by article ID", () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.article).to.be.an("object");
          expect(res.body.article).to.include.keys("_id", "votes", "title");
        });
    });
    it("GET returns a status 404 and an error if the article ID if false", () => {
      return request
        .get(`/api/articles/${mongoose.Types.ObjectId()}`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Article Not Found");
        });
    });
    it("GET returns a status 200 and returns comments for an article by its ID", () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.body).to.equal(articleDocs[0].comment);
          expect(res.body.comments).to.include.keys(
            "_id",
            "votes",
            "belongs_to"
          );
        });
    });
    it("GET returns a status 404 and an error message is article ID doesnt exist", () => {
      return request
        .get(`/api/articles/${mongoose.Types.ObjectId()}/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid article ID");
        });
    });
    it("POST returns a status 201 and adds a new comment to an article by its ID", () => {
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send({
          body: "this is a test comment",
          belongs_to: articleDocs[0]._id,
          created_by: userDocs[0]._id
        })
        .expect(201)
        .then(res => {
          expect(res.body.body).to.equal("this is a test comment");
        });
    });
    it("POST returns a status 400 and an error when trying to add an epmty comment", () => {
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad Request");
        });
    });
    it("PATCH returns a status 200 and increases the votes of an article by 1", () => {
      return request
        .patch(`/api/articles/${articleDocs[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(1);
        });
    });
    it("PATCH returns a 404 status and an error when using an ID that doesnt exist", () => {
      return request
        .get(`/api/articles/${mongoose.Types.ObjectId()}?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Article Not Found");
        });
    });
    it("PATCH resturns a status 200 and lowers the votes of an article by 1", () => {
      return request
        .patch(`/api/articles/${articleDocs[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(-1);
        });
    });
    it("PATCH returns a 404 status and an error when using an article ID that doesnt exist", () => {
      return request
        .get(`/api/articles/${mongoose.Types.ObjectId()}?vote=down`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Article Not Found");
        });
    });
  });
  describe("/comments", () => {
    it("PATCH returns a status 200 and increases the votes on a comment by 1 using the comment ID", () => {
      return request
        .patch(`/api/comments/${commentDocs[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(commentDocs[0].votes + 1);
        });
    });
    it("PATCH returns a status 404 and an error message when using a comment ID that doesnt exist", () => {
      return request
        .get(`/api/comments/${mongoose.Types.ObjectId()}?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Page not found");
        });
    });
    it("PATCH returns a status 200 and lowers the votes of a comment, using its ID, by 1", () => {
      return request
        .patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(commentDocs[0].votes - 1);
        });
    });
    it("PATCH returns a 404 status and an error when using a comment ID that doesnt exist", () => {
      return request
        .patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(commentDocs[0].votes - 1);
        });
    });
    it("DELETE returns a status 200 and deletes the comment by its ID", () => {
      return request
        .delete(`/api/comments/${commentDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.msg).to.equal("A Comment Was Sucessfully Deleted!");
        });
    });
  });
  describe("/users", () => {
    it("GET Returns a status 200 and an object of the user by username", () => {
      return request
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(res => {
          expect(res.body.user).to.include.keys("username", "name");
        });
    });
    it("GET returns a status 404 using a username that doesnt exist", () => {
      return request
        .get(`/api/users/${mongoose.Types.ObjectId()}`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("user not found");
        });
    });
  });
});

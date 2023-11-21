const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpointsData = require("../endpoints.json");

afterAll(() => {
  db.end();
});

beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("200: responds with all the topics with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
  test("404: responds with path not found when passed an incorrect path", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path not found");
      });
  });
});

describe("GET /api", () => {
  test("200: responds with an object describing all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsData);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an articles choosen by id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article[0]).toHaveProperty("author", expect.any(String));
        expect(article[0]).toHaveProperty("title", expect.any(String));
        expect(article[0]).toHaveProperty("article_id", expect.any(Number));
        expect(article[0]).toHaveProperty("body", expect.any(String));
        expect(article[0]).toHaveProperty("topic", expect.any(String));
        expect(article[0]).toHaveProperty("created_at", expect.any(String));
        expect(article[0]).toHaveProperty("votes", expect.any(Number));
        expect(article[0]).toHaveProperty(
          "article_img_url",
          expect.any(String)
        );
      });
  });
  test("400: responds with bad request with passed a string as id", () => {
    return request(app)
      .get("/api/articles/two")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: responds with not found with passed a nonexistent number id", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", {descending: true})
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty(
            "article_img_url",
            expect.any(String)
          );
        });
      });
  });
  test("404: responds with path not found when passed an incorrect path", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
        });
      });
  });
  test("200: responds with an empty array when passed a valid article_id with no comment", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("400: responds with bad request with passed a string as id", () => {
    return request(app)
      .get("/api/articles/two/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: responds with not found with passed a nonexistent number id", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
    const newComment = {
        username: "rogersop",
        body: "Nice article"
    }
    test("201: responds with the posted comment", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({body:{comment}})=>{
            expect(comment[0]).toHaveProperty("comment_id", 19)
            expect(comment[0]).toHaveProperty("body", newComment.body)
            expect(comment[0]).toHaveProperty("article_id", 2)
            expect(comment[0]).toHaveProperty("author", newComment.username)
            expect(comment[0]).toHaveProperty("votes", 0)
            expect(comment[0]).toHaveProperty("created_at", expect.any(String))
        })
    });
    test("400: responds with bad request with passed a string as id", () => {
        return request(app)
          .post("/api/articles/two/comments")
          .send(newComment)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      test("400: responds with bad request with passed an invalid new comment", () => {
        const invalidComment = {body: "Nice article"}
        return request(app)
          .post("/api/articles/2/comments")
          .send(invalidComment)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request");
          });
      });
      test("404: responds with not found with passed an id that does not exist", () => {
        return request(app)
          .post("/api/articles/100/comments")
          .send(newComment)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("not found");
          });
      });
});
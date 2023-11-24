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

// /api
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

// /api/topics
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

describe("POST /api/topics", () => {
  test("201: responds with the posted topic", () => {
    const newTopic = {
      slug: "dogs",
      description: "Who doesn't love dogs",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toHaveProperty("slug", newTopic.slug);
        expect(topic).toHaveProperty("description", newTopic.description);
      });
  });
  test("400: responds with bad request when passed an invalid new topic", () => {
    const invalidTopic = { description: "Who doesn't love dogs" };
    return request(app)
      .post("/api/topics")
      .send(invalidTopic)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("400: responds with bad request when passed a slug that already exists", () => {
    return request(app)
      .post("/api/topics")
      .send({
        description: "Not dogs",
        slug: "cats",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

// /api/articles
describe("GET /api/articles/:article_id", () => {
  test("200: responds with an articles choosen by id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("article_id", expect.any(Number));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
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

describe("GET /api/articles/:article_id (now updated to include comment_count)", () => {
  test("200: responds with an articles choosen by id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("comment_count", expect.any(String));
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
        expect(articles.length).toBe(10);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
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

describe("GET /api/articles (topic query)", () => {
  test("200: responds with articles filtered by specific topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).toHaveProperty("topic", "mitch");
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
      });
  });
  test("404: respond with not found when passed a topic that does not exist", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("400: respond with bad request when passed a number as topic", () => {
    return request(app)
      .get("/api/articles?topic=2")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200: responds with an array of articles sorted by the query", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
        expect(articles).toBeSortedBy("votes", { descending: true });
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
      });
  });
  test("200: responds with an array of articles sorted and ordered by the query", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
        expect(articles).toBeSortedBy("title");
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
      });
  });
  test("400: responds with bad request when passed invalid sort_by queries", () => {
    return request(app)
      .get("/api/articles?sort_by=abc")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("400: responds with bad request when passed invalid order queries", () => {
    return request(app)
      .get("/api/articles?order=abc")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("400: responds with bad request when passed invalid sort_by and order queries", () => {
    return request(app)
      .get("/api/articles?sort_by=aaa&order=abc")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles (limit and p queries)", () => {
  test("200: responds with an array of articles according to limit", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(5);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
      });
  });
  test("200: responds with an array of articles according to limit and p", () => {
    return request(app)
      .get("/api/articles?limit=6&p=2")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(6);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
      });
  });
  test("400: responds with bad request when passed invalid limit queries", () => {
    return request(app)
      .get("/api/articles?limit=ten")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("400: responds with bad request when passed invalid p queries", () => {
    return request(app)
      .get("/api/articles?limit=12&p=two")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: responds with not found when gone pass the existing articles", () => {
    return request(app)
      .get("/api/articles?limit=10&p=99")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
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
    body: "Nice article",
  };
  test("201: responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toHaveProperty("comment_id", 19);
        expect(comment).toHaveProperty("body", newComment.body);
        expect(comment).toHaveProperty("article_id", 2);
        expect(comment).toHaveProperty("author", newComment.username);
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("400: responds with bad request when passed a string as id", () => {
    return request(app)
      .post("/api/articles/two/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("400: responds with bad request when passed an invalid new comment", () => {
    const invalidComment = { body: "Nice article" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(invalidComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: responds with not found when passed an id that does not exist", () => {
    return request(app)
      .post("/api/articles/100/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("404: responds with not found when passed a username that does not exist", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "alexis",
        body: "Nice article",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

describe("POST /api/articles", () => {
  test("201: responds with the posted article when post without article_img_url", () => {
    const newArticle = {
      author: "rogersop",
      body: "article",
      title: "title",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("article_id", expect.any(Number));
        expect(article).toHaveProperty("votes", 0);
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("comment_count", expect.any(String));
        expect(article).toHaveProperty("body", newArticle.body);
        expect(article).toHaveProperty("author", newArticle.author);
        expect(article).toHaveProperty("title", newArticle.title);
        expect(article).toHaveProperty("topic", newArticle.topic);
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
  test("201: responds with the posted article when post with article_img_url", () => {
    const newArticle = {
      author: "rogersop",
      body: "article",
      title: "title",
      topic: "cats",
      article_img_url: "an URL",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("article_id", expect.any(Number));
        expect(article).toHaveProperty("votes", 0);
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("comment_count", expect.any(String));
        expect(article).toHaveProperty("body", newArticle.body);
        expect(article).toHaveProperty("author", newArticle.author);
        expect(article).toHaveProperty("title", newArticle.title);
        expect(article).toHaveProperty("topic", newArticle.topic);
        expect(article).toHaveProperty(
          "article_img_url",
          newArticle.article_img_url
        );
      });
  });
  test("400: responds with bad request when passed an incomplete new article", () => {
    const incompleteArticle = { body: "article" };
    return request(app)
      .post("/api/articles")
      .send(incompleteArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: responds with not found when passed a author that does not exist", () => {
    const newArticle = {
      author: "alexis",
      body: "article",
      title: "title",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  const updateVote = { inc_votes: 1 };
  test("201: responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send(updateVote)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("article_id", 3);
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
  test("400: responds with bad request with passed a string as id", () => {
    return request(app)
      .patch("/api/articles/three")
      .send(updateVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: responds with not found with passed an id that does not exist", () => {
    return request(app)
      .patch("/api/articles/88")
      .send(updateVote)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("400: responds with bad request with passed an invalid request body", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: no respond body", () => {
    return request(app).delete("/api/articles/6").expect(204);
  });
  test("400: responds with bad request with passed a string as id", () => {
    return request(app)
      .delete("/api/articles/six")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: responds with not found with passed an id that does not exist", () => {
    return request(app)
      .delete("/api/articles/199")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

// /api/users
describe("GET /api/users", () => {
  test("200: responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
  test("404: responds with path not found when passed an incorrect path", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: responds with a user choosen by username", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toHaveProperty("username", expect.any(String));
        expect(user).toHaveProperty("name", expect.any(String));
        expect(user).toHaveProperty("avatar_url", expect.any(String));
      });
  });
  test("404: responds with not found with passed a nonexistent username", () => {
    return request(app)
      .get("/api/users/abc2")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

// /api/comments
describe("PATCH /api/comments/:comment_id", () => {
  const updateVote = { inc_votes: 1 };
  test("201: responds with the updated comment", () => {
    return request(app)
      .patch("/api/comments/3")
      .send(updateVote)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toHaveProperty("comment_id", 3);
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment).toHaveProperty("author", expect.any(String));
        expect(comment).toHaveProperty("body", expect.any(String));
        expect(comment).toHaveProperty("votes", expect.any(Number));
        expect(comment).toHaveProperty("article_id", expect.any(Number));
      });
  });
  test("400: responds with bad request with passed a string as id", () => {
    return request(app)
      .patch("/api/comments/three")
      .send(updateVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: responds with not found with passed an id that does not exist", () => {
    return request(app)
      .patch("/api/comments/88")
      .send(updateVote)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("400: responds with bad request with passed an invalid request body", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: no respond body", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });
  test("400: responds with bad request with passed a string as id", () => {
    return request(app)
      .delete("/api/comments/five")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: responds with not found with passed an id that does not exist", () => {
    return request(app)
      .delete("/api/comments/111")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

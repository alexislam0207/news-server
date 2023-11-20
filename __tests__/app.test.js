const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

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
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("400: responds with path not found when passed an incorrect path",
    () => {
      return request(app)
        .get("/api/topic")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("path not found");
        });
    });
});

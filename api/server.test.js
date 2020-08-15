const request = require("supertest");
const server = require("./server");
const db = require("../database/dbConfig");

const loginInfo = { username: "test", password: "test" };
let token = "";

describe("server.js", () => {
  test("should be in test mode", async () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});
describe("POST /register", () => {
  let res = {};
  beforeAll(async () => {
    await db("users").truncate();
    res = await request(server).post("/api/auth/register").send(loginInfo);
  });
  test("should return 201 status", async () => {
    expect(res.status).toBe(201);
  });
  test("should return created username", async () => {
    expect(res.body.username).toBe("test");
  });
});
describe("POST /login", () => {
  let res = {};
  beforeAll(async () => {
    res = await request(server).post("/api/auth/login").send(loginInfo);
    token = res.body.jwt;
  });
  test("should return 200 status", async () => {
    expect(res.status).toBe(200);
  });
  test("should return welcome message", async () => {
    expect(res.body.message).toContain("test");
  });
  test("should return JWT", async () => {
    expect(res.body.jwt).toBeDefined();
  });
});
// describe("GET /jokes", () => {
//   let res = {};
//   beforeAll(async () => {
//     res = await request(server)
//       .get("/api/jokes")
//       .send({
//         headers: { accept: "application/json", Authorization: `bearer ${token}` },
//       });
//   });
//   test("should return some data", async () => {
//     console.log(res.status);
//     // expect(res.body).toBe(200)
//   });
// });

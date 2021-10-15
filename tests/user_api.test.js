const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("../tests/test_helper");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});
});

describe("User login / registration", () => {
  test("Valid user is added", async () => {
    await api
        .post("/api/users")
        .send(helper.validUser)
        .expect(200);
    const currentUsers = await User.find({})
    expect(currentUsers).toHaveLength(1)
  });

  test("Invalid user is rejected with 400", async () => {
    const request = await api
        .post("/api/users")
        .send(helper.invalidUser)
        .expect(400);
    const currentUsers = await User.find({})
    expect(currentUsers).toHaveLength(0)
  });
});

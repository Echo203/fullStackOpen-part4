const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("../tests/test_helper");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");

const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  //Reseting user DB with one valid credentials for tests
  await User.deleteMany({});
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(
    helper.initialValidUser.password,
    saltRounds
  );

  const user = new User({
    username: helper.initialValidUser.username,
    passwordHash,
    _id: helper.validUser._id
  });

  const initialValidUser = new User(user);
  await initialValidUser.save();

  //Reseting blog DB
  await Blog.deleteMany({});
  const blogObjects = helper.initialPosts.map((post) => new Blog(post));
  const arrayOfPromisses = blogObjects.map((blogObject) => blogObject.save());
  await Promise.all(arrayOfPromisses);
});

test("There are six blog posts in DB", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialPosts.length);
});

test('Identifier is called "ID"', async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

//POST method
test("Succesful post method", async () => {
  //Login in as valid user named "Tornado"
  const res = await api.post("/api/login").send(helper.initialValidUser);

  const token = res.body.token;

  await api
    .post("/api/blogs")
    .send(helper.singlePost)
    .set({ Authorization: `baerer ${token}` })
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const updatedBlogList = await api.get("/api/blogs");
  expect(updatedBlogList.body).toHaveLength(helper.initialPosts.length + 1);

  const namesInBlogPostAfterUpdate = updatedBlogList.body.map((r) => r.title);
  expect(namesInBlogPostAfterUpdate).toContain(helper.singlePost.title);
});

//Default like value
test("Default likes value, if missing is set to 0", async () => {
  const res = await api.post("/api/login").send(helper.initialValidUser);
  const token = res.body.token;

  await api
    .post("/api/blogs")
    .send(helper.singlePostWithoutLikesProperity)
    .set({ Authorization: `baerer ${token}` });

  const response = await api.get("/api/blogs");
  expect(response.body[response.body.length - 1].likes).toEqual(0);
});

//Error handling - missing properities
test("Expecting 400, missing properities post", async () => {
  const res = await api.post("/api/login").send(helper.initialValidUser);
  const token = res.body.token;

  const dummyPost = {
    author: "No idea",
    likes: 3,
  };

  await api
    .post("/api/blogs")
    .send(dummyPost)
    .set({ Authorization: `baerer ${token}` })
    .expect(400);
});

//DELETE method - valid
test("Deleting valid note", async () => {
  //Logging in
  const res = await api.post("/api/login").send(helper.initialValidUser);
  const token = res.body.token;

  const newBlog = await api
    .post("/api/blogs")
    .send(helper.singlePost)
    .set({ Authorization: `baerer ${token}` })
    .expect(201)

  const idToDelete = newBlog.body.id

  await api
    .delete(`/api/blogs/${idToDelete}`)
    .send({ })
    .set({ Authorization: `baerer ${token}` })
    .expect(204);

  const response = await api.get("/api/blogs");
  //Length will not change in the final form, we still check if note was posted and later deleted
  expect(response.body.length).toEqual(helper.initialPosts.length);

  const newSetOfPosts = response.body.map((r) => r.title);
  expect(newSetOfPosts).not.toContain(helper.singlePost.title);
});

//
test("Deleting note with invalid token fails", async () => {
  //Logging in
  const res = await api.post("/api/login").send(helper.initialValidUser);
  const token = res.body.token;

  const newBlog = await api
    .post("/api/blogs")
    .send(helper.singlePost)
    .set({ Authorization: `baerer ${token}` })
    .expect(201)

  const idToDelete = newBlog.body.id

  //Not providing authorization header
  await api
    .delete(`/api/blogs/${idToDelete}`)
    .expect(401);
});

//PUT method - updating likes

test("Updating likes value, on already existing note", async () => {
  const postToUpdate = helper.initialPosts[0];
  const updatedLikesValue = { likes: 10 };

  await api.put(`/api/blogs/${postToUpdate._id}`).send(updatedLikesValue);

  const response = await api.get("/api/blogs");
  expect(response.body[0].likes).toEqual(updatedLikesValue.likes);
});

afterAll(() => {
  mongoose.connection.close();
});

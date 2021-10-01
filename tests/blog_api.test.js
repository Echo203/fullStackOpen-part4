const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("../tests/test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialPosts.map(post => new Blog(post))
  const arrayOfPromisses = blogObjects.map(blogObject => blogObject.save())
  await Promise.all(arrayOfPromisses)
});

test('There are six blog posts in DB', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialPosts.length)
})

test('Identifier is called "ID"', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

//POST method
test('Succesful post method', async () => {
  await api
  .post('/api/blogs')
  .send(helper.singlePost)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const updatedBlogList = await api.get('/api/blogs')
  expect(updatedBlogList.body).toHaveLength(helper.initialPosts.length + 1)

  const namesInBlogPostAfterUpdate = updatedBlogList.body.map(r => r.title)
  expect(namesInBlogPostAfterUpdate).toContain(helper.singlePost.title)
})

//Default like value
test('Default likes value, if missing is set to 0', async () => {
  await api
    .post('/api/blogs')
    .send(helper.singlePostWithoutLikesProperity)
  
  const response = await api.get('/api/blogs')
  expect(response.body[response.body.length -1].likes).toEqual(0)
})

//Error handling - missing properities
test('Expecting 400, missing properities post', async () => {
  const dummyPost = {
    author: "No idea",
    likes: 3
  }
  
  await api
      .post('/api/blogs')
      .send(dummyPost)
      .expect(400)
      
})

afterAll(() => {
    mongoose.connection.close()
  })
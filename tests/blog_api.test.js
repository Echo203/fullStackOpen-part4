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




afterAll(() => {
    mongoose.connection.close()
  })
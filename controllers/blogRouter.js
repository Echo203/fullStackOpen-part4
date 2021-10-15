const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const userExtractor = require('../utils/userExtractor')

blogRouter.get("/", async (request, response) => {
  const posts = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(posts);
});

//POST method handling
blogRouter.post("/", userExtractor, async (request, response) => {
  const user = request.user

  const blogObject = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user.id,
  });

  const savedBlog = await blogObject.save();
  response.status(201).json(savedBlog);
});

// DELETE method handling
blogRouter.delete("/:id", userExtractor, async (req, res) => {
  const user = req.user

  const blog = await Blog.findById(req.params.id)
  if (blog.user._id.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
  }
  res.status(401)
});

blogRouter.put("/:id", async (req, res) => {
  const blogPost = {
    likes: req.body.likes,
  };

  const updatedBlogPost = await Blog.findByIdAndUpdate(
    req.params.id,
    blogPost,
    { new: true }
  );
  res.json(updatedBlogPost);
});

module.exports = blogRouter;

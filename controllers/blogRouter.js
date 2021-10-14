const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response) => {
  const posts = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(posts);
});

blogRouter.post("/", async (request, response) => {
  const token = body.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id) {
    return response.status(400).json({ error: 'invalid or missing token' })
  }

  const user = User.findById(decodedToken.id)

  const blogObject = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id,
  });

  const savedBlog = await blogObject.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
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

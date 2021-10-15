const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response) => {
  const posts = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(posts);
});

blogRouter.post("/", async (request, response) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id) {
    return response.status(401).json({ error: 'invalid or missing token' })
  }

  const user = await User.findById(decodedToken.id)

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
blogRouter.delete("/:id", async (req, res) => {
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)

  const blog = await Blog.findById(req.params.id)
  if (blog.user._id.toString() === decodedToken.id.toString()) {
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

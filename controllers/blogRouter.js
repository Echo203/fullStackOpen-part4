const blogRouter = require("express").Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const posts = await Blog.find({})
    response.json(posts)
  })
  
  blogRouter.post('/', async (request, response) => {
    const blogObject = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes
    })
    
    const savedBlog = await blogObject.save()
    response.status(201).json(savedBlog)
    
  })

module.exports = blogRouter
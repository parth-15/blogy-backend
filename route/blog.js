const Blog = require('../model/blog');

const getAllBlogs = (request, response) => {
  Blog.find({}).then((blogs) => response.json(blogs));
};

const postOneBlog = (request, response) => {
  const blog = new Blog(request.body);
  console.log(request.body);
  blog.save().then((result) => response.status(201).json(result));
};

module.exports = { getAllBlogs, postOneBlog };

const blogRouter = require('express').Router();
const Blog = require('../model/blog');

const getAllBlogs = async (request, response) => {
  const blogs = await Blog.find({});
  response.status(200).json(blogs);
};

const getOneBlog = async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  return response.status(200).json(blog);
};

const postOneBlog = async (request, response) => {
  const blog = new Blog(request.body);
  console.log(request.body);
  const result = await blog.save();
  response.status(201).json(result);
};

const updateOneBlog = async (request, response) => {
  const newBlog = request.body;
  const id = request.params.id;
  const updatedNote = await Blog.findByIdAndUpdate(id, newBlog, { new: true });
  response.status(200).json(updatedNote);
};

const deleteBlogById = async (request, response) => {
  const id = request.params.id;
  const result = await Blog.findByIdAndDelete(id);
  return response.status(200).json(result).send();
};

blogRouter.get('/', getAllBlogs);
blogRouter.get('/:id', getOneBlog);
blogRouter.post('/', postOneBlog);
blogRouter.put('/:id', updateOneBlog);
blogRouter.delete('/:id', deleteBlogById);

module.exports = blogRouter;

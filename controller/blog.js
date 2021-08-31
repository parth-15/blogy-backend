const blogRouter = require('express').Router();
const Blog = require('../model/blog');

const getAllBlogs = async (request, response) => {
  const blogs = await Blog.find({});
  response.status(200).json(blogs);
};

const getOneBlog = async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  response.status(200).json(blog);
};

const postOneBlog = async (request, response) => {
  const blog = new Blog(request.body);
  console.log(request.body);
  try {
    const result = await blog.save();
    return response.status(201).json(result);
  } catch (e) {
    console.log(e);
    return response.status(400).send();
  }
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
  if (result) {
    response.status(200).json(result).send();
  } else {
    response.status(404).send();
  }
};

blogRouter.get('/', getAllBlogs);
blogRouter.get('/:id', getOneBlog);
blogRouter.post('/', postOneBlog);
blogRouter.put('/:id', updateOneBlog);
blogRouter.delete('/:id', deleteBlogById);

module.exports = blogRouter;

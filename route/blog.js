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
  // TODO: Refactor this into middleware
  if (!blog.title || !blog.url) {
    return response.status(400).send();
  }
  if (!blog.likes) {
    blog.likes = 0;
  }
  const result = await blog.save();
  return response.status(201).json(result);
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

module.exports = {
  getAllBlogs,
  getOneBlog,
  postOneBlog,
  updateOneBlog,
  deleteBlogById,
};

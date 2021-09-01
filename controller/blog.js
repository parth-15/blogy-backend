const blogRouter = require('express').Router();
const Blog = require('../model/blog');
const User = require('../model/user');

const getAllBlogs = async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.status(200).json(blogs);
};

const getOneBlog = async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id).populate('user');
  return response.status(200).json(blog);
};

const postOneBlog = async (request, response) => {
  const body = request.body;
  const userId = body.user;
  const user = await User.findById(userId);
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: userId,
  });
  const savedBlog = await blog.save();
  console.log(user);
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
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

const deleteAllBlogs = async (request, response) => {
  const deletedCount = await Blog.deleteMany({});
  response.status(200).json(deletedCount);
};

blogRouter.get('/', getAllBlogs);
blogRouter.get('/:id', getOneBlog);
blogRouter.post('/', postOneBlog);
blogRouter.put('/:id', updateOneBlog);
blogRouter.delete('/__deleteAll__', deleteAllBlogs);
blogRouter.delete('/:id', deleteBlogById);

module.exports = blogRouter;

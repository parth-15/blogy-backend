const blogRouter = require('express').Router();
const ObjectId = require('mongoose').Types.ObjectId;
const Blog = require('../model/blog');
const User = require('../model/user');

const { userExtractorFromToken } = require('../utils/middleware');

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
  const user = request.user;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
};

const updateOneBlog = async (request, response) => {
  const newBlog = request.body;
  const id = request.params.id;
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes: newBlog.likes },
    { new: true }
  );

  response.status(200).json(updatedBlog);
};

const deleteBlogById = async (request, response) => {
  const id = request.params.id;
  const user = request.user;
  const blogToBeDeleted = await Blog.findById(id);
  if (blogToBeDeleted.user.toString() === user.id.toString()) {
    const result = await Blog.findByIdAndDelete(id);
    user.blogs.splice(user.blogs.indexOf(blogToBeDeleted.id), 1);
    await user.save();
    return response.status(204).json(result).send();
  }
  return response
    .status(401)
    .json({ error: 'user not authorised to delete the blog' });
};

const deleteAllBlogs = async (request, response) => {
  const deletedCount = await Blog.deleteMany({});
  response.status(204).json(deletedCount);
};

blogRouter.get('/', getAllBlogs);
blogRouter.get('/:id', userExtractorFromToken, getOneBlog);
blogRouter.post('/', userExtractorFromToken, postOneBlog);
blogRouter.put('/:id', updateOneBlog);
blogRouter.delete('/__deleteAll__', deleteAllBlogs);
blogRouter.delete('/:id', deleteBlogById);

module.exports = blogRouter;

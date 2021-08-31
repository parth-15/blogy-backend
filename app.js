const express = require('express');
const cors = require('cors');
const {
  getAllBlogs,
  getOneBlog,
  postOneBlog,
  deleteBlogById,
  updateOneBlog,
} = require('./route/blog');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/blogs', getAllBlogs);
app.get('/api/blogs/:id', getOneBlog);
app.post('/api/blogs', postOneBlog);
app.put('/api/blogs/:id', updateOneBlog);
app.delete('/api/blogs/:id', deleteBlogById);

module.exports = app;

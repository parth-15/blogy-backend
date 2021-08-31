const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { getAllBlogs, postOneBlog } = require('./route/blog');

const app = express();

const mongoUrl =
  'mongodb+srv://blogy-user:UCw8IGVFP6y95KfI@cluster0.4r8hi.mongodb.net/blogs?retryWrites=true&w=majority';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

app.get('/api/blogs', getAllBlogs);
app.post('/api/blogs', postOneBlog);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app };

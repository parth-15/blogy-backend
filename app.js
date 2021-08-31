const express = require('express');
const cors = require('cors');
const blogRouter = require('./controller/blog');
const { requestLogger, errorHandler } = require('./utils/middleware');

const app = express();
app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use('/api/blogs', blogRouter);

app.use(errorHandler);

module.exports = app;

const express = require('express');
const cors = require('cors');
require('express-async-errors');
const blogRouter = require('./controller/blog');
const userRouter = require('./controller/user');
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middleware');

const app = express();
app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);
app.use(unknownEndpoint);

module.exports = app;

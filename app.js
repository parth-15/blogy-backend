const express = require('express');
const cors = require('cors');
require('express-async-errors');
const blogRouter = require('./controller/blog');
const userRouter = require('./controller/user');
const {
  getTokenFromRequest,
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractorFromToken,
} = require('./utils/middleware');
const loginRouter = require('./controller/login');

const app = express();
app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use(getTokenFromRequest);

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);
app.use(unknownEndpoint);

module.exports = app;

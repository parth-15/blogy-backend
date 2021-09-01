const jwt = require('jsonwebtoken');
const User = require('../model/user');
const logger = require('./logger');

const getTokenFromRequest = (request, response, next) => {
  const authorizationField = request.get('authorization');
  if (
    authorizationField &&
    authorizationField.toLowerCase().startsWith('bearer ')
  ) {
    request.token = authorizationField.substring(7);
  } else {
    request.token = null;
  }
  next();
};

const userExtractorFromToken = async (request, response, next) => {
  const id = request.params.id;
  const token = request.token;
  const decodedToken = token ? jwt.verify(token, process.env.SECRET) : null;
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);
  request.user = user;
  next();
};

const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method);
  logger.info('Path:', request.path);
  logger.info('Body:', request.body);
  logger.info('------------------------------------');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = {
  getTokenFromRequest,
  userExtractorFromToken,
  requestLogger,
  unknownEndpoint,
  errorHandler,
};

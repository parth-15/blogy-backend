const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../model/user');

const checkPasswordAndSendToken = async (request, response) => {
  const body = request.body;
  const user = await User.findOne({ username: body.username });
  const isPasswordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);
  if (!user || !isPasswordCorrect) {
    return response.status(401).send({
      error: 'Invalid Username or Password',
    });
  }
  const userFieldsForToken = {
    username: user.username,
    id: user._id,
  };
  const token = jwt.sign(userFieldsForToken, process.env.SECRET);
  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
};

loginRouter.post('/', checkPasswordAndSendToken);

module.exports = loginRouter;

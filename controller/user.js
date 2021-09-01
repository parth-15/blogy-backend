const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../model/user');

const getAllUsers = async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.status(200).json(users);
};

const getOneUser = async (request, response) => {
  const id = request.params.id;
  const user = await User.findById(id);
  response.status(200).json(user);
};

const postOneUser = async (request, response) => {
  const body = request.body;
  const { username, password } = body;
  if (!username || !password) {
    return response
      .status(400)
      .json({ error: 'username and password must be provided' });
  }
  if (username.length <= 3 || password.length <= 3) {
    return response.status(400).json({
      error: 'username and password must be atleast 3 characters long',
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);
  const user = new User({
    username,
    name: body.name,
    passwordHash,
  });
  const savedUser = await user.save();
  return response.status(201).json(savedUser);
};

const deleteAllUser = async (request, response) => {
  const deletedCount = await User.deleteMany({});
  response.status(200).json(deletedCount);
};

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getOneUser);
userRouter.post('/', postOneUser);
userRouter.delete('/__deleteAll__', deleteAllUser);

module.exports = userRouter;

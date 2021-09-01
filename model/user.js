const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  name: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.passwordHash;
    delete ret._id;
    delete ret.__v;
  },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name cannot be empty'],
    maxlength: [40, 'Name cannot be more than 40 characters']
  },
  username: {
    type: String,
    required: [true, 'Username cannot be empty'],
    unique: [true, 'Username already exists'],
    maxlength: [30, 'Username cannot be more than 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email cannot be empty'],
    unique: [true, 'Email already exists']
  },
  password: {
    type: String,
    minlength: [4, 'Password cannot be less than 4 characters'],
    required: [true, 'Password cannot be empty']
  },
  idAdmin: {
    type: Boolean,
    default: false
  },
  calories_per_day: {
    type: Number,
    required: [true, 'Calories is required']
  },
  meal: {
    type: Array,
    default: []
  }
});

// @desc    Encrypt password before saving the user in the database
// @return  Null
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// @desc    Remove unecessary information
// @return  User object
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  userObj._id = userObj._id.toString();
  delete userObj.password;
  return userObj;
};

// @desc    Compare password
// @return  User object
userSchema.statics.verifyCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new HttpError('Invalid email or password', 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new HttpError('Invalid email or password', 400);
  return user;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//models
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "USername is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  failedAttempts: {
    type: Number,
    default: 0,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  blockedAt: {
    type: Date,
    default: null,
  },
});

//hashed password
userSchema.pre("save", async function (next) {
  //update
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//match password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

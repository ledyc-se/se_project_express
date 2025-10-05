const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Invalid email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Invalid URL",
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user)
        return Promise.reject(new Error("Incorrect email or password"));

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched)
          return Promise.reject(new Error("Incorrect email or password"));
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
} = require("../utils/errors");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }

      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return res.send(userWithoutPassword);
    })
    .catch((err) => next(err));
};

const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password || !name) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email, password, and name are required" });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        avatar,
      })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "User already exists" });
      }

      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }

      return res
        .status(SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch(() =>
      res.status(401).send({ message: "Incorrect email or password" })
    );
};

const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }

      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return res.send(userWithoutPassword);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for update" });
      }

      return res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateCurrentUser,
};

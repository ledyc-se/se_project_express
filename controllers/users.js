const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  ServerError,
  UnauthorizedError,
} = require("../utils/errors");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }

      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      res.send(userWithoutPassword);
    })
    .catch((err) => {
      console.error("getCurrentUser error:", err);
      next(new ServerError("An error occurred while fetching user info"));
    });
};

const createUser = (req, res, next) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password || !name) {
    return next(new BadRequestError("Email, password, and name are required"));
  }

  bcrypt
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
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error("Create User Error:", err);

      if (err.code === 11000) {
        next(new ConflictError("User already exists"));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError("Invalid data when creating user"));
      } else {
        next(new ServerError("Internal server error"));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error("Login error:", err);
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

const updateCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }

      const userObj = user.toObject();
      delete userObj.password;
      res.send(userObj);
    })
    .catch((err) => {
      console.error("Update user error:", err);

      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided for update"));
      } else {
        next(new ServerError("An error occurred while updating user"));
      }
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateCurrentUser,
};

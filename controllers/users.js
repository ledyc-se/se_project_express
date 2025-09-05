const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });

const getCurrentUser = (req, res) => {
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
    .catch((err) => {
      console.error("getCurrentUser error:", err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(201).send(userWithoutPassword);
  } catch (err) {
    console.error("Create User Error:", err);

    if (
      err.code === 11000 ||
      (err.name === "MongoServerError" && err.code === 11000)
    ) {
      console.log("Duplicate email error detected");
      return res.status(409).send({ message: "Email already exists" });
    }

    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid data passed when creating a user" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
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
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(401).send({ message: "Incorrect email or password" });
    });
};

const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for update" });
      }
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  login,
  updateCurrentUser,
};

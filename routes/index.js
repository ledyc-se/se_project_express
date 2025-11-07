const express = require("express");
const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const {
  validateCreateUser,
  validateLogin,
} = require("../middlewares/validation");

const router = express.Router();

router.post("/signin", validateLogin, login);
router.post("/signup", validateCreateUser, createUser);

router.use("/users", userRouter);
router.use("/items", itemRouter);

module.exports = router;

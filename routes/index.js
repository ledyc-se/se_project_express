const express = require("express");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);


router.use(auth);

router.use("/users", userRouter);
router.use("/items", itemRouter);

module.exports = router;

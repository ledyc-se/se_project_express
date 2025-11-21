const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");

const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

const auth = require("../middlewares/auth");
const { validateUpdateUser } = require("../validators/userValidators");

const router = express.Router();

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, validateUpdateUser, updateCurrentUser);

module.exports = router;

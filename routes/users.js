const express = require("express");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

const auth = require("../middlewares/auth");
const { validateCreateUser } = require("../middlewares/validation");

const router = express.Router();

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, validateCreateUser, updateCurrentUser);

module.exports = router;

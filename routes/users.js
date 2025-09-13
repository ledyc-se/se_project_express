const express = require("express");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateCurrentUser);

module.exports = router;

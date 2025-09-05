const express = require("express");
const {
  getUsers,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/users");

const router = express.Router();

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", updateCurrentUser);

module.exports = router;

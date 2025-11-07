const express = require("express");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");
const {
  validateCreateItem,
  validateItemId,
} = require("../middlewares/validation");

const router = express.Router();

router.get("/", auth, getItems);

router.post("/", auth, validateCreateItem, createItem);

router.delete("/:itemId", auth, validateItemId, deleteItem);

router.put("/:itemId/likes", auth, validateItemId, likeItem);

router.delete("/:itemId/likes", auth, validateItemId, dislikeItem);

module.exports = router;

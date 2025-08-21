const express = require("express");

const router = express.Router();

const Item = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");
const { likeItem, dislikeItem } = require("../controllers/clothingItems");

router.get("/", (req, res) =>
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    })
);

router.post("/", (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data passed when creating an item" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
});

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

router.delete("/:itemId", (req, res) => {
  const { itemId } = req.params;

  return Item.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.send({ message: "Item deleted", item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
});

module.exports = router;

const mongoose = require("mongoose");
const Item = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const getItems = (req, res) => {
  return Item.find({})
    .then((items) => res.send(items))
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" })
    );
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data passed when creating an item" });
      }

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = async (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  try {
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }

    if (item.owner.toString() !== userId.toString()) {
      return res
        .status(FORBIDDEN)
        .send({ message: "You are not allowed to delete this item" });
    }

    await item.deleteOne();
    return res.send({ message: "Item deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

const likeItem = (req, res, next) => {
  return Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }

      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }

      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }

  return Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }

      return res.send(item);
    })
    .catch((err) => next(err));
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};

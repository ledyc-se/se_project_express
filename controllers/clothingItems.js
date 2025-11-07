const mongoose = require("mongoose");
const Item = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ServerError,
} = require("../utils/errors");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      next(new ServerError("An error occurred while fetching items"));
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data passed when creating an item"));
      } else {
        next(new ServerError("An error occurred while creating the item"));
      }
    });
};

const deleteItem = async (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  try {
    const item = await Item.findById(itemId);

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    if (item.owner.toString() !== userId.toString()) {
      throw new ForbiddenError("You are not allowed to delete this item");
    }

    await item.deleteOne();
    res.send({ message: "Item deleted" });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      next(new BadRequestError("Invalid item ID"));
    } else {
      next(err);
    }
  }
};

const likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(new ServerError("An error occurred while liking the item"));
      }
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }

  Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.send(item);
    })
    .catch((err) => {
      console.error("Dislike Item Error:", err);
      next(new ServerError("An error occurred while disliking the item"));
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};

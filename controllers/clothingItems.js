const mongoose = require("mongoose");
const Item = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ServerError,
} = require("../utils/errors");

<<<<<<< HEAD
const getItems = (req, res) => {
  return Item.find({})
    .then((items) => res.send(items))
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" })
    );
=======
const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      next(new ServerError("An error occurred while fetching items"));
    });
>>>>>>> 0fccd469bd0d56901ca85a3294d5f31dd73388f8
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data passed when creating an item"));
      } else {
        next(new ServerError("An error occurred while creating the item"));
      }
<<<<<<< HEAD

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
=======
>>>>>>> 0fccd469bd0d56901ca85a3294d5f31dd73388f8
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
    if (err.name === "CastError") {
      next(new BadRequestError("Invalid item ID"));
    } else {
      next(err);
    }
<<<<<<< HEAD

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
=======
>>>>>>> 0fccd469bd0d56901ca85a3294d5f31dd73388f8
  }
};

const likeItem = (req, res, next) => {
<<<<<<< HEAD
  return Item.findByIdAndUpdate(
=======
  Item.findByIdAndUpdate(
>>>>>>> 0fccd469bd0d56901ca85a3294d5f31dd73388f8
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
<<<<<<< HEAD

      return res.send(item);
=======
      res.send(item);
>>>>>>> 0fccd469bd0d56901ca85a3294d5f31dd73388f8
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(new ServerError("An error occurred while liking the item"));
      }
<<<<<<< HEAD

      return next(err);
    });
};

=======
    });
};

>>>>>>> 0fccd469bd0d56901ca85a3294d5f31dd73388f8
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
<<<<<<< HEAD

      return res.send(item);
    })
    .catch((err) => next(err));
=======
      res.send(item);
    })
    .catch((err) => {
      console.error("Dislike Item Error:", err);
      next(new ServerError("An error occurred while disliking the item"));
    });
>>>>>>> 0fccd469bd0d56901ca85a3294d5f31dd73388f8
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};

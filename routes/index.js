const router = require("express").Router();
const itemsRouter = require("./clothingItems");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", itemsRouter);

module.exports = router;

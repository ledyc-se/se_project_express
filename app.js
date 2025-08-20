const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/index");
const itemsRouter = require("./routes/clothingItems");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "68a64c2a49763d3665d25d8b",
  };
  next();
});

app.use("/", userRouter);
app.use("/items", itemsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

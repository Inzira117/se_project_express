const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to _db");
  })
  .catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "67b0cb2db9b90b7e26b00b01",
  };
  next();
});

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

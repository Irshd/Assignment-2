const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.json());

const postRoutes = require("./routes/post");
require("dotenv").config();

app.use(express.json());
app.use("/api", postRoutes);
mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb://localhost:/assignment",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to DB");
  }
);

app.listen(3000, () => {
  console.log("server listening");
});

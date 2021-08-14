const express = require("express");
const bodyparser = require("body-parser");
const registerAPI = require("./routes");
require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express()
  .use(bodyparser.json())
  .use(bodyparser.urlencoded({ extended: true }));

registerAPI(app);

app.listen(process.env.PORT || 5000, () => {
  console.log("listening at port: ");
});

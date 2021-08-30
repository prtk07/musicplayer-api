const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const registerAPI = require("./routes");
require("dotenv").config();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((e) => {
    console.log("error at connection" + e);
  });

const app = express()
  .use(bodyparser.json())
  .use(bodyparser.urlencoded({ extended: true }))
  .use(cors());

registerAPI(app);

app.listen(process.env.PORT || 5000, () => {
  console.log("listening at port: ");
});

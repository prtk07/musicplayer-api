const { Schema, model } = require("mongoose");
const UserSchema = new Schema(require("./users.schema.json"));

const User = model("User", UserSchema);

module.exports = User;

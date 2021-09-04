const User = require("./users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");

require("dotenv").config();

async function UserExists(email) {
  try {
    let existingUser = await User.findOne({ email }).exec();
    if (existingUser) return Promise.reject(new Error("User already exists"));
    else return Promise.resolve();
  } catch (e) {
    return Promise.reject(new Error("Something went wrong at signup"));
  }
}

async function encryptPassword(plaintext, rounds = 10) {
  return await bcrypt.hash(plaintext, rounds);
}

async function checkPassword(plaintext, hash) {
  return await bcrypt.compare(plaintext, hash);
}

function tokenGenerator(user) {
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      iat: moment().unix(),
      exp: moment().add(10, "days").unix(),
    },
    process.env.TOKEN_SECRET
  );
}

function tokenDecrypt(token) {
  return jwt.decode(token);
}

module.exports = {
  UserExists,
  encryptPassword,
  checkPassword,
  tokenGenerator,
  tokenDecrypt,
};

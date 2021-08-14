const User = require("./users.model");
const {
  UserExists,
  encryptPassword,
  tokenGenerator,
} = require("./users.utils");

async function signup(req, res, next) {
  const { email, password, name, phone } = req.body;
  const hash = await encryptPassword(password);
  const user = new User({
    name,
    email,
    phone,
    hash,
  });

  try {
    await UserExists(email);

    await user.save();
  } catch (e) {
    return next(e);
  }
  res.locals.data = { token: tokenGenerator(user) };
  return next();
}

function login(req, res, next) {
  const { email, password } = req.body;
  console.log("login");
}

module.exports = {
  signup,
  login,
};

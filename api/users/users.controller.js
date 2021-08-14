const User = require("./users.model");
const {
  UserExists,
  encryptPassword,
  tokenGenerator,
  checkPassword,
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

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(new Error("User does not exists"));

    const passwordMatch = await checkPassword(password, user.hash);
    if (passwordMatch) {
      res.locals.data = { token: tokenGenerator(user) };
    } else return next(new Error("password does not match"));
  } catch (e) {
    return next(e);
  }
  return next();
}

module.exports = {
  signup,
  login,
};

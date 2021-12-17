const {
  sendVerificationMail,
  sendForgotPasswordMail,
} = require("../../integrations/sendGrid");
const User = require("./users.model");
const {
  UserExists,
  encryptPassword,
  tokenGenerator,
  checkPassword,
  tokenDecrypt,
} = require("./users.utils");

async function signup(req, res, next) {
  const { email, password, name, phone } = req.body;
  const hash = await encryptPassword(password);
  const user = new User({
    name,
    email,
    phone,
    hash,
    isVerified: false,
  });

  try {
    await UserExists(email);

    await user.save();
    sendVerificationMail(user, tokenGenerator(user, [10, "minutes"]));
  } catch (e) {
    return next(e);
  }

  // res.locals.data = { token: tokenGenerator(user) };
  return next();
}

async function getUserDetails(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const { email } = tokenDecrypt(token);
  try {
    const user = await User.findOne({ email });
    res.locals.data = { ...user };
  } catch (e) {
    return next(e);
  }
  return next();
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(new Error("User does not exists"));

    const passwordMatch = await checkPassword(password, user.hash);
    if (passwordMatch) {
      if (!user.isVerified) return next(new Error("User not verified"));

      res.locals.data = { token: tokenGenerator(user) };
    } else return next(new Error("password does not match"));
  } catch (e) {
    return next(e);
  }
  return next();
}

async function verifyToken(req, res, next) {
  const { token } = req.params;
  const { email, name } = tokenDecrypt(token);

  try {
    const user = await User.findOne({ email });
    if (!user) return next(new Error("Token Invalid"));

    if (user) {
      user.isVerified = true;
      await user.save();
    }
  } catch (e) {
    return next(e);
  }
  return next();
}

async function forgotPassword(req, res, next) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(new Error("User does not exist"));

    if (user && user.isVerified) {
      sendForgotPasswordMail(user, tokenGenerator(user, [10, "minutes"]));
      res.locals.data = {
        message: "Reset Link sent to User's Email: " + user.email,
      };
    } else return next(new Error("User is not Verified"));
  } catch (e) {
    return next(new Error("Something went wrong"));
  }
  return next();
}

async function newPassword(req, res, next) {
  const { newPassword, confirmPassword } = req.body;
  const { token } = req.params;

  try {
    const { email } = tokenDecrypt(token);
    const user = await User.findOne({ email });

    if (!user) return next(new Error("user invalid"));

    if (newPassword !== confirmPassword)
      return next(new Error("Password does match"));

    user.hash = await encryptPassword(newPassword);

    await user.save();
  } catch (e) {
    return next(new Error("something went wrong"));
  }

  return next();
}

module.exports = {
  signup,
  login,
  getUserDetails,
  verifyToken,
  forgotPassword,
  newPassword,
};

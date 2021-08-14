const responseHandler = require("./response");
const user = require("./api/users");

module.exports = (app) => {
  app.get("/", (req, res, next) => res.sendStatus(200));
  app.use("/user", user, responseHandler);
};

const responseHandler = require("./response");
const user = require("./api/users");

module.exports = (app) => {
  app.get("/", (req, res, next) => res.sendStatus(200));
  app.use("/user", user, responseHandler);

  app.use((err, req, res, next) => {
    if (err) {
      const status =
        res.locals.status ||
        err.statusCode ||
        err.status ||
        (err.output && err.output.statusCode) ||
        400;
      return res.status(status).send({ message: err.message });
    }
    return next();
  });
};

function respond(req, res, next) {
  const response = res.locals.data || { status: "OK" };
  return res.status(res.locals.status || 200).send(response);
}

module.exports = respond;

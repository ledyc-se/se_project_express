const { isCelebrateError } = require("celebrate");

function errorHandler(err, req, res, next) {
  if (isCelebrateError(err)) {
    const validation = {};
    for (const [segment, joiError] of err.details.entries()) {
      validation[segment] = joiError.details.map((detail) => detail.message);
    }
    return res.status(400).send({ message: "Validation failed", validation });
  }

  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An internal server error occurred" : message,
  });
}

module.exports = errorHandler;

const AppError = require("./appError");
const { BAD_REQUEST } = require("./errorCodes");

class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, BAD_REQUEST);
  }
}

module.exports = BadRequestError;

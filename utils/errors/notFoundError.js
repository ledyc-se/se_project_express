const AppError = require("./appError");
const { NOT_FOUND } = require("./errorCodes");

class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, NOT_FOUND);
  }
}

module.exports = NotFoundError;

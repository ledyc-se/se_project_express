const AppError = require("./appError");
const { FORBIDDEN } = require("./errorCodes");

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, FORBIDDEN);
  }
}

module.exports = ForbiddenError;

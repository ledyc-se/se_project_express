const AppError = require("./appError");
const { UNAUTHORIZED } = require("./errorCodes");

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;

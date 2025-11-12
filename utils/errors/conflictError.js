const AppError = require("./appError");
const { CONFLICT } = require("./errorCodes");

class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, CONFLICT);
  }
}

module.exports = ConflictError;

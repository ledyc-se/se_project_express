const AppError = require("./appError");
const { SERVER_ERROR } = require("./errorCodes");

class ServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, SERVER_ERROR);
  }
}

module.exports = ServerError;

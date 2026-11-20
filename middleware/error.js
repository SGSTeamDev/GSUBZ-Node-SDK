const { sendResponse } = require("../utils/helpers");

class AppError extends Error {
  constructor(code, status, description, data) {
    super(description);
    this.status = status;
    this.code = code;
    this.description = description;
    this.data = data;
  }
}

const handleError = (err) => {
  return sendResponse(
    err.code || 500,
    err.status || "failed",
    err.description || err.message || "API error",
    typeof err.data !== "undefined" ? err.data : void 0,
  );
};

module.exports = {
  AppError,
  handleError,
};

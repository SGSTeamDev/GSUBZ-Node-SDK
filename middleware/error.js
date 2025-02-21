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
    err.description || "API error",
    err.status,
    err.data !== undefined ? err.data : undefined
  );
};

module.exports = {
  AppError,
  handleError,
};

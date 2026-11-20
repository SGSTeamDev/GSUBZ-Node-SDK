const { AppError } = require("../middleware/error.js");

const PURCHASE_TIMEOUT_MS = 10 * 60 * 1000;
const STATUS_TIMEOUT_MS = 15 * 1000;

class Gsubz {
  constructor(request) {
    this.request = request;
  }

  async balance(data) {
    return this.request("/balance/", {
      method: "POST",
      data,
      timeout: STATUS_TIMEOUT_MS,
    });
  }

  async plans(query) {
    return this.request("/plans", {
      method: "GET",
      query,
      timeout: STATUS_TIMEOUT_MS,
    });
  }

  async service(query) {
    return this.request("/service", {
      method: "GET",
      query,
      timeout: STATUS_TIMEOUT_MS,
    });
  }

  async pay(data) {
    if (!data || !data.serviceID) {
      throw new AppError(400, "failed", "serviceID is required.");
    }

    return this.request("/pay/", {
      method: "POST",
      data,
      timeout: PURCHASE_TIMEOUT_MS,
    });
  }

  async verifyPay(data) {
    if (!data || (!data.requestID && !data.transactionID)) {
      throw new AppError(
        400,
        "failed",
        "requestID or transactionID is required.",
      );
    }

    return this.request("/verify/", {
      method: "POST",
      data,
      timeout: STATUS_TIMEOUT_MS,
    });
  }
}

module.exports = Gsubz;

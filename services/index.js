const { AppError } = require("../middleware/error.js");

class Gsubz {
  constructor(request) {
    this.request = request;
  }

  async balance(data) {
    return this.request("/balance/", { method: "POST", data });
  }

  async plans(query) {
    return this.request("/plans", { method: "GET", query });
  }

  async service(query) {
    return this.request("/service", { method: "GET", query });
  }

  async pay(data) {
    if (!data || !data.serviceID) {
      throw new AppError(400, "failed", "serviceID is required.");
    }

    return this.request("/pay/", { method: "POST", data });
  }

  async verifyPay(data) {
    if (!data || !data.requestID) {
      throw new AppError(400, "failed", "requestID is required.");
    }

    return this.request("/verify/", { method: "POST", data });
  }
}

module.exports = Gsubz;

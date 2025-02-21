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
    return this.request("/pay/", { method: "POST", data });
  }

  async verifyPay(data) {
    return this.request("/verify/", { method: "POST", data });
  }
}

module.exports = Gsubz;

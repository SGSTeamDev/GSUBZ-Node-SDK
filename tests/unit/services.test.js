const Gsubz = require("../../services");

describe("SERVICE DISPATCH", () => {
  it("sends balance as a POST", async () => {
    const request = jest.fn().mockResolvedValue({ code: 200 });
    const services = new Gsubz(request);

    await services.balance({});

    expect(request).toHaveBeenCalledWith("/balance/", {
      method: "POST",
      data: {},
      timeout: 15000,
    });
  });

  it("sends plans as a GET query", async () => {
    const request = jest.fn().mockResolvedValue({ code: 200 });
    const services = new Gsubz(request);

    await services.plans({ service: "gotv" });

    expect(request).toHaveBeenCalledWith("/plans", {
      method: "GET",
      query: { service: "gotv" },
      timeout: 15000,
    });
  });

  it("sends service details as a GET query", async () => {
    const request = jest.fn().mockResolvedValue({ code: 200 });
    const services = new Gsubz(request);

    await services.service({ service: "mtn" });

    expect(request).toHaveBeenCalledWith("/service", {
      method: "GET",
      query: { service: "mtn" },
      timeout: 15000,
    });
  });

  it("sends payment as a POST", async () => {
    const request = jest.fn().mockResolvedValue({ code: 200 });
    const services = new Gsubz(request);
    const data = { serviceID: "mtn", phone: "+2348000000000", amount: 100 };

    await services.pay(data);

    expect(request).toHaveBeenCalledWith("/pay/", {
      method: "POST",
      data,
      timeout: 600000,
    });
  });

  it("sends payment verification as a POST", async () => {
    const request = jest.fn().mockResolvedValue({ code: 200 });
    const services = new Gsubz(request);

    await services.verifyPay({ requestID: "3696898674" });

    expect(request).toHaveBeenCalledWith("/verify/", {
      method: "POST",
      data: { requestID: "3696898674" },
      timeout: 15000,
    });
  });

  it("accepts a transaction ID for payment verification", async () => {
    const request = jest.fn().mockResolvedValue({ code: 200 });
    const services = new Gsubz(request);

    await services.verifyPay({ transactionID: "3574357094" });

    expect(request).toHaveBeenCalledWith("/verify/", {
      method: "POST",
      data: { transactionID: "3574357094" },
      timeout: 15000,
    });
  });

  it("rejects a payment without a service ID", async () => {
    const request = jest.fn();
    const services = new Gsubz(request);

    await expect(services.pay({ phone: "+2348000000000" })).rejects.toMatchObject({
      code: 400,
      status: "failed",
      description: "serviceID is required.",
    });
    expect(request).not.toHaveBeenCalled();
  });

  it("rejects verification without a reference", async () => {
    const request = jest.fn();
    const services = new Gsubz(request);

    await expect(services.verifyPay({})).rejects.toMatchObject({
      code: 400,
      status: "failed",
      description: "requestID or transactionID is required.",
    });
    expect(request).not.toHaveBeenCalled();
  });
});

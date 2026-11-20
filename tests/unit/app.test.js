const app = require("../../app");
const { AppError } = require("../../middleware/error");

describe("SDK COMPOSITION", () => {
  it("requires an API key", () => {
    expect(() => app()).toThrow(AppError);
    expect(() => app()).toThrow("API key is required.");
  });

  it("exposes the documented service methods", () => {
    const gsubz = app("test-key");

    for (const method of ["balance", "plans", "service", "pay", "verifyPay"]) {
      expect(typeof gsubz[method]).toBe("function");
    }
  });
});

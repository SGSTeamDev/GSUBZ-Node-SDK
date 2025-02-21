/**
 * THIS SCRIPT SERVES AS A TEMPLATE
 *
 * IT IS NOT INCLUDED IN THE RUNNING TEST SUITES
 * SO IT WON'T BE PART OF THE REPORT
 * SEE 'jest.testPathIgnorePatterns' IN package.json
 *
 * HOW TO USE THIS TEMPLATE:
 * COPY THIS FILE AND RENAME COPIED FILE OR
 * COPY SCRIPTS IN THIS FILE TO ANOTHER FILE
 */

const app = require("../app");

describe("API Service Tests", () => {
  let instance;
  beforeEach(() => {
    // process.env.KEY from env.test
    instance = app(process.env.API_KEY);
  });

  test("should fetch balance", async () => {
    const res = await instance.balance();

    expect(res.code).toBe(200);
    expect(res.data).toHaveProperty("balance");
  });

  test("should fetch tv sub plans", async () => {
    const res = await instance.plans({ service: "gotv" });

    expect(res.code).toBe(200);
    expect(Array.isArray(res.data.list)).toBe(true);
  });

  test("should buy data", async () => {
    const res = await instance.pay({
      serviceID: "mtn_sme",
      plan: 179,
      phone: "+2348168643908",
      amount: "",
    });

    expect(res.code).toBe(200);
    expect(res.status).toBe("status", "TRANSACTION_SUCCESSFUL");
    expect(res.data).toHaveProperty("content");
  });

  test("should buy airtime", async () => {
    const res = await instance.pay({
      serviceID: "mtn",
      phone: "+2348160381840",
      amount: 100,
    });

    expect(res.code).toBe(200);
    expect(res.status).toBe("status", "TRANSACTION_SUCCESSFUL");
    expect(res.data).toHaveProperty("content");
  });
});

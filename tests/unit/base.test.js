jest.mock("axios", () => jest.fn());

const axios = require("axios");
const base = require("../../lib/base");
const { AppError } = require("../../middleware/error");

class MockFormData {
  constructor() {
    this.entries = [];
  }

  append(key, value) {
    this.entries.push([key, value]);
  }
}

const originalFormData = global.FormData;

beforeAll(() => {
  global.FormData = MockFormData;
});

afterAll(() => {
  global.FormData = originalFormData;
});

beforeEach(() => {
  axios.mockReset();
});

const response = (data) => ({ status: 200, data });

describe("TRANSPORT VALIDATION", () => {
  it("rejects a missing API key with a complete error shape", () => {
    expect(() => base()).toThrow(AppError);
    expect(() => base()).toThrow("API key is required.");

    try {
      base();
    } catch (error) {
      expect(error).toMatchObject({
        code: 500,
        status: "failed",
        description: "API key is required.",
      });
    }
  });

  it("rejects a missing request method", async () => {
    const request = base("key");

    await expect(request("/plans", {})).rejects.toMatchObject({
      code: 400,
      status: "failed",
      description: "Request method is required.",
    });
    expect(axios).not.toHaveBeenCalled();
  });

  it("rejects a null request payload", async () => {
    const request = base("key");

    await expect(request("/plans", null)).rejects.toMatchObject({
      code: 400,
      status: "failed",
      description: "Request method is required.",
    });
    expect(axios).not.toHaveBeenCalled();
  });

  it("rejects a GET request without a service query", async () => {
    const request = base("key");

    await expect(request("/plans", { method: "GET", query: {} })).rejects.toMatchObject({
      code: 400,
      status: "failed",
      description: "serviceID is required.",
    });
    expect(axios).not.toHaveBeenCalled();
  });

  it("builds GET query strings without mutating the caller payload", async () => {
    axios.mockResolvedValueOnce(response({ code: 200, status: "success", list: [] }));

    const request = base("key");
    const payload = { method: "GET", query: { service: "gotv", page: 1 } };
    await request("/plans", payload);

    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: "https://api.gsubz.com/api/plans?service=gotv&page=1",
      headers: { Authorization: "Bearer key" },
    });
    expect(payload).toEqual({ method: "GET", query: { service: "gotv", page: 1 } });
  });

  it("sends POST payloads as FormData while skipping null and undefined values", async () => {
    axios.mockResolvedValueOnce(
      response({ code: 200, status: "TRANSACTION_SUCCESSFUL", description: "ok" }),
    );

    const request = base("key");
    await request("/pay/", {
      method: "POST",
      data: { serviceID: "mtn", amount: "", phone: null, plan: undefined },
    });

    const config = axios.mock.calls[0][0];
    expect(config.data).toBeInstanceOf(MockFormData);
    expect(config.data.entries).toEqual([
      ["serviceID", "mtn"],
      ["amount", ""],
    ]);
  });

  it("applies a caller-supplied timeout", async () => {
    axios.mockResolvedValueOnce(
      response({ code: 200, status: "success", list: [] }),
    );

    await base("key")("/plans", {
      method: "GET",
      query: { service: "gotv" },
      timeout: 15000,
    });

    expect(axios.mock.calls[0][0].timeout).toBe(15000);
  });

  it("passes an existing FormData body through unchanged", async () => {
    axios.mockResolvedValueOnce(
      response({ code: 200, status: "TRANSACTION_SUCCESSFUL", description: "ok" }),
    );

    const formData = new MockFormData();
    await base("key")("/pay/", { method: "POST", data: formData });

    expect(axios.mock.calls[0][0].data).toBe(formData);
  });
});

describe("SUCCESS MAPPING", () => {
  it("maps a balance response", async () => {
    axios.mockResolvedValueOnce(response({ balance: 1500 }));

    await expect(base("key")("/balance/", { method: "POST", data: {} })).resolves.toEqual({
      code: 200,
      status: "success",
      description: "Wallet balance",
      data: { balance: 1500 },
    });
  });

  it("maps a plans response", async () => {
    axios.mockResolvedValueOnce(response({ list: [{ plan: 179 }] }));

    await expect(
      base("key")("/plans", { method: "GET", query: { service: "gotv" } }),
    ).resolves.toEqual({
      code: 200,
      status: "success",
      description: "gotv plans",
      data: { list: [{ plan: 179 }] },
    });
  });

  it("maps a service details response", async () => {
    axios.mockResolvedValueOnce(response({ displayName: "MTN" }));

    await expect(
      base("key")("/service", { method: "GET", query: { service: "mtn" } }),
    ).resolves.toMatchObject({
      code: 200,
      status: "success",
      description: "Service details.",
    });
  });

  it("accepts a string success code", async () => {
    axios.mockResolvedValueOnce(
      response({
        code: "200",
        status: "success",
        description: "TRANSACTION_SUCCESSFUL",
        transaction_id: "3574357094",
      }),
    );

    await expect(
      base("key")("/verify/", {
        method: "POST",
        data: { requestID: "req-1" },
      }),
    ).resolves.toEqual({
      code: "200",
      status: "success",
      description: "TRANSACTION_SUCCESSFUL",
      data: { transaction_id: "3574357094" },
    });
  });

  it("maps a successful transaction response", async () => {
    axios.mockResolvedValueOnce(
      response({
        code: 200,
        status: "TRANSACTION_SUCCESSFUL",
        description: "Payment successful",
        content: { transactionID: "1" },
      }),
    );

    await expect(
      base("key")("/pay/", { method: "POST", data: { serviceID: "mtn" } }),
    ).resolves.toEqual({
      code: 200,
      status: "TRANSACTION_SUCCESSFUL",
      description: "Payment successful",
      data: { content: { transactionID: "1" } },
    });
  });
});

describe("PROVIDER FAILURES", () => {
  it("maps a provider failure returned with HTTP 200", async () => {
    axios.mockResolvedValueOnce(
      response({
        code: 400,
        status: "failed",
        description: "Insufficient balance",
        content: { reference: "ref-1" },
      }),
    );

    await expect(
      base("key")("/pay/", { method: "POST", data: { serviceID: "mtn" } }),
    ).rejects.toMatchObject({
      code: 400,
      status: "failed",
      description: "Insufficient balance",
      data: { content: { reference: "ref-1" } },
    });
  });

  it("rejects a successful code with a failed status", async () => {
    axios.mockResolvedValueOnce(
      response({ code: 200, status: "failed", description: "Transaction failed" }),
    );

    await expect(
      base("key")("/pay/", { method: "POST", data: { serviceID: "mtn" } }),
    ).rejects.toMatchObject({
      code: 200,
      status: "failed",
      description: "Transaction failed",
    });
  });

  it("rejects an empty successful response", async () => {
    axios.mockResolvedValueOnce({ status: 200, data: null });

    await expect(
      base("key")("/pay/", { method: "POST", data: { serviceID: "mtn" } }),
    ).rejects.toMatchObject({
      code: 400,
      status: "failed",
      description: "Request failed.",
    });
  });

  it("rejects an unexpected non-object response", async () => {
    axios.mockResolvedValueOnce(response([{ plan: 1 }]));

    await expect(
      base("key")("/plans", { method: "GET", query: { service: "gotv" } }),
    ).rejects.toMatchObject({
      code: 502,
      status: "failed",
      description: "Unexpected provider response.",
    });
  });

  it("preserves and redacts provider details from an axios error", async () => {
    axios.mockRejectedValueOnce({
      message: "Request failed with status code 400",
      response: {
        status: 400,
        data: {
          code: 400,
          status: "failed",
          description: "Bearer provider-secret account 1234567890",
          token: "secret-token",
          content: { reference: "ref-1" },
        },
      },
    });

    let error;
    try {
      await base("key")("/pay/", { method: "POST", data: { serviceID: "mtn" } });
    } catch (caught) {
      error = caught;
    }

    expect(error).toMatchObject({
      code: 400,
      status: "failed",
      description: "Bearer [REDACTED] account [REDACTED]",
      data: { content: { reference: "ref-1" } },
    });
    expect(error.data).not.toHaveProperty("token");
  });

  it("falls back to a generic transport error when the provider gives no details", async () => {
    axios.mockRejectedValueOnce({ message: "socket hang up" });

    await expect(
      base("key")("/pay/", { method: "POST", data: { serviceID: "mtn" } }),
    ).rejects.toMatchObject({
      code: 500,
      status: "failed",
      description: "socket hang up",
    });
  });
});

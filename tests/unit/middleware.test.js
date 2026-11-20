const { AppError, handleError } = require("../../middleware/error");
const { sendResponse } = require("../../utils/helpers");

describe("ERROR HANDLING", () => {
  it("creates an AppError with code, status, description, and data", () => {
    const error = new AppError(400, "failed", "Bad request", { field: "serviceID" });

    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({
      code: 400,
      status: "failed",
      description: "Bad request",
      data: { field: "serviceID" },
    });
  });

  it("maps an AppError to the public response shape", () => {
    const response = handleError(new AppError(402, "ERROR_IN_PAYMENT", "Payment failed", { id: 1 }));

    expect(response).toEqual({
      code: 402,
      status: "ERROR_IN_PAYMENT",
      description: "Payment failed",
      data: { id: 1 },
    });
  });

  it("keeps status and description in the correct response fields", () => {
    const response = handleError(new AppError(400, "failed", "serviceID is required."));

    expect(response.code).toBe(400);
    expect(response.status).toBe("failed");
    expect(response.description).toBe("serviceID is required.");
  });

  it("falls back to a server error for unknown errors", () => {
    const response = handleError(new Error("boom"));

    expect(response).toMatchObject({
      code: 500,
      status: "failed",
      description: "boom",
    });
    expect(response.data).toBeUndefined();
  });

  it("omits undefined response data", () => {
    const response = sendResponse(200, "success", "ok");

    expect(response).toEqual({
      code: 200,
      status: "success",
      description: "ok",
      data: undefined,
    });
  });
});

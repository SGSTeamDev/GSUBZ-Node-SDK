const { safeProviderData, safeProviderText } = require("../../lib/providerSafety");

describe("PROVIDER SAFETY", () => {
  it("returns null for non-string text", () => {
    expect(safeProviderText(null)).toBeNull();
    expect(safeProviderText(123)).toBeNull();
    expect(safeProviderText({ message: "x" })).toBeNull();
  });

  it("redacts bearer credentials, key assignments, and JWTs", () => {
    expect(
      safeProviderText(
        "Bearer provider-secret authorization=abc api_key: xyz eyJheader.payload.signature",
      ),
    ).toBe("Bearer [REDACTED] authorization=[REDACTED] api_key=[REDACTED] [REDACTED]");
  });

  it("redacts long numeric identifiers", () => {
    expect(safeProviderText("account 1234567890 failed")).toBe("account [REDACTED] failed");
  });

  it("bounds provider text to 500 characters", () => {
    expect(safeProviderText("x".repeat(600))).toHaveLength(500);
  });

  it("filters sensitive keys and sanitizes nested provider data", () => {
    const data = safeProviderData({
      content: { reference: "ref-1", account: "1234567890" },
      token: "secret-token",
      list: Array.from({ length: 60 }, (_, index) => index),
      password: "secret",
      empty: null,
    });

    expect(data).toEqual({
      content: { reference: "ref-1", account: "[REDACTED]" },
      list: Array.from({ length: 50 }, (_, index) => index),
    });
    expect(data.token).toBeUndefined();
    expect(data.password).toBeUndefined();
  });
});

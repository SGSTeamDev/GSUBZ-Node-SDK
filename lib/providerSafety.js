const SENSITIVE_KEY = /(token|secret|password|passwd|authorization|api[_-]?key|access[_-]?key|private[_-]?key|otp|pin)/i;
const MAX_TEXT_LENGTH = 500;
const MAX_DEPTH = 3;
const MAX_ITEMS = 50;

function safeProviderText(value) {
  if (typeof value !== "string") return null;

  return value
    .slice(0, MAX_TEXT_LENGTH)
    .replace(/bearer\s+[^\s,]+/gi, "Bearer [REDACTED]")
    .replace(/(token|secret|password|otp|pin|authorization|api[_-]?key|access[_-]?token)[=:]\s*[^\s,]+/gi, "$1=[REDACTED]")
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[REDACTED]")
    .replace(/\b\d{6,}\b/g, "[REDACTED]");
}

function safeProviderData(value, depth = 0) {
  if (value === null) return null;
  if (depth > MAX_DEPTH) return null;

  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_ITEMS)
      .map((item) => safeProviderData(item, depth + 1))
      .filter((item) => item !== null);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, MAX_ITEMS)
        .filter(([key]) => !SENSITIVE_KEY.test(key))
        .map(([key, item]) => [key, safeProviderData(item, depth + 1)])
        .filter(([, item]) => item !== null),
    );
  }

  if (typeof value === "string") return safeProviderText(value);
  if (typeof value === "number" || typeof value === "boolean") return value;

  return null;
}

module.exports = { safeProviderText, safeProviderData };

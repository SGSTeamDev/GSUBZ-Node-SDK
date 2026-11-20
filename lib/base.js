const axios = require("axios");

const { AppError } = require("../middleware/error.js");
const { safeProviderData, safeProviderText } = require("./providerSafety");
const { sendResponse } = require("../utils/helpers");

const BASE_URL = "https://api.gsubz.com/api";
const SUCCESS_CODES = [200, 201];

function buildQueryString(query) {
  if (!query || typeof query !== "object") return "";

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (typeof value !== "undefined" && value !== null) params.append(key, value);
  });
  return params.toString();
}

function buildFormData(data) {
  if (typeof FormData !== "undefined" && data instanceof FormData) return data;

  const formData = new FormData();
  Object.entries(data || {}).forEach(([key, value]) => {
    if (typeof value !== "undefined" && value !== null) formData.append(key, value);
  });
  return formData;
}

function parseProviderError(error) {
  const response = error?.response;
  const body =
    response?.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? response.data
      : {};
  const hasProviderDetails = ["code", "status", "description", "message"].some(
    (field) => typeof body[field] !== "undefined",
  );

  if (!response && !hasProviderDetails) return null;

  const { code, status, description, message, ...extra } = body;

  return {
    code: typeof code !== "undefined" ? code : response?.status || 500,
    status: safeProviderText(status) || "failed",
    description:
      safeProviderText(description) || safeProviderText(message) || "Request failed.",
    data: safeProviderData(extra),
  };
}

const base = (key) => {
  if (typeof key !== "string" || key.trim() === "") {
    throw new AppError(500, "failed", "API key is required.");
  }

  const request = async (path, payload = {}) => {
    const options = payload || {};

    if (typeof options.method !== "string" || !options.method) {
      throw new AppError(400, "failed", "Request method is required.");
    }

    const method = options.method.toUpperCase();
    const query = options.query;
    let request_url = `${BASE_URL}${path}`;

    if (method === "GET") {
      const query_string = buildQueryString(query);
      request_url += query_string ? `?${query_string}` : "";
    }

    if (method === "GET" && (!query || !query.service)) {
      throw new AppError(400, "failed", "serviceID is required.");
    }

    const timeout = Number(options.timeout);
    const config = {
      method,
      url: request_url,
      headers: {
        Authorization: `Bearer ${key}`,
      },
      ...(Number.isFinite(timeout) && timeout > 0 ? { timeout } : {}),
    };

    if (method === "POST") {
      config.data = buildFormData(options.data);
    } else if (!["GET", "DELETE"].includes(method)) {
      config.data = options.data;
    }

    try {
      const response = await axios(config);
      const data = response.data;

      if (response.status === 200 && !data) {
        throw new AppError(400, "failed", "Request failed.");
      }

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new AppError(502, "failed", "Unexpected provider response.");
      }

      const { code, status, description, ...extra_data } = data;

      if (extra_data.balance) {
        return sendResponse(200, "success", "Wallet balance", extra_data);
      }

      if ((extra_data.plans || extra_data.list) && query && query.service) {
        return sendResponse(200, "success", `${query.service} plans`, extra_data);
      }

      if (path === "/service" && extra_data.displayName) {
        return sendResponse(200, "success", "Service details.", extra_data);
      }

      if (SUCCESS_CODES.includes(Number(code)) && status !== "failed") {
        return sendResponse(code, status, description, extra_data);
      }

      throw new AppError(
        typeof code !== "undefined" ? code : response.status,
        safeProviderText(status) || "failed",
        safeProviderText(description) ||
          safeProviderText(data.api_response) ||
          "Request failed.",
        safeProviderData(extra_data),
      );
    } catch (error) {
      if (error instanceof AppError) throw error;

      const providerError = parseProviderError(error);
      if (providerError) {
        throw new AppError(
          providerError.code,
          providerError.status,
          providerError.description,
          providerError.data,
        );
      }

      throw new AppError(500, "failed", safeProviderText(error?.message) || "API error.");
    }
  };

  return request;
};

module.exports = base;

const querystring = require("querystring");

const axios = require("axios");
const { AppError } = require("../middleware/error.js");
const { sendResponse } = require("../utils/helpers");

const base = (key) => {
  if (!key) throw new AppError(500, "API key is required.");

  const base_url = "https://api.gsubz.com/api";

  const request = async (path, payload = {}) => {
    try {
      if (!payload.method) {
        throw new AppError(500, "Request method is required.");
      }

      const method = payload.method.toUpperCase();
      let request_url = `${base_url}${path}`;

      // add query string to url
      if (method.toUpperCase() === "GET" && payload.query) {
        const query_string = querystring.stringify(payload.query);
        request_url += query_string ? `?${query_string}` : "";
      }

      // set payload data (request payload) to empty object if method is GET or DELETE
      if (method.toUpperCase() === "GET" || method.toUpperCase() === "DELETE") {
        payload.data = {};
      }

      const config = {
        method,
        url: request_url,
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        data:
          method === "POST"
            ? (() => {
                const formData = new FormData();
                Object.entries(payload.data || {}).forEach(([key, value]) => {
                  formData.append(key, value);
                });
                return formData;
              })()
            : payload.data,
      };

      if (method == "GET" && (!payload.query || !payload.query.service)) {
        throw new AppError(400, "failed", "serviceID is required.");
      }

      const response = await axios(config);

      const data = response.data;

      if (response.status == 200 && !data) {
        throw new AppError(400, "failed", "Request failed.");
      }

      const { code, status, description, ...extra_data } = data;

      if (extra_data.balance) {
        return sendResponse(200, "success", "Wallet balance", extra_data);
      }

      if ((extra_data.plans || extra_data.list) && payload.query.service) {
        return sendResponse(
          200,
          "success",
          `${payload.query.service} plans`,
          extra_data
        );
      }

      if (
        response.status == 200 &&
        path == "/service" &&
        extra_data.displayName
      ) {
        return sendResponse(200, "success", "Service details.", extra_data);
      }

      if ((code === 200 || code === 201) && data.status !== "failed") {
        return sendResponse(code, status, description, extra_data);
      } else {
        throw new AppError(
          data.code,
          data.status || "failed",
          data.description || data.api_response || "Request failed.",
          extra_data
        );
      }
    } catch (error) {
      if (error && error.code) {
        const { code, status, description, data } = error;
        if (code && status && description) {
          throw new AppError(code, status, description, data);
        }
      }
      throw new AppError(500, "failed", "API error.");
    }
  };

  return request;
};

module.exports = base;

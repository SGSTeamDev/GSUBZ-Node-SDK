const helpers = {
  sendResponse(code, status, description, data) {
    const response = {
      code,
      status,
      description,
    };

    if (data) response.data = data;

    return response;
  },
};

module.exports = helpers;

const helpers = {
  sendResponse(code, status, description, data) {
    return {
      code,
      status,
      description,
      data: data ? data : undefined,
    };
  },
};

module.exports = helpers;

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const base = require("./lib/base");
const Gsubz = require("./services");

module.exports = (key) => {
  const request = base(key);

  return new Gsubz(request);
};

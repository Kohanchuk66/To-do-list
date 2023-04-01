const { sign } = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports.signPayload = (payload, time) => {
  return sign(payload, process.env.SECRET_KEY, { expiresIn: time });
};

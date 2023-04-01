const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports.protect = async (req, res, next) => {
  try {
    const token =
      req.headers?.authorization?.split(" ")[1] ||
      req.headers?.security.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Unauthorized.",
        });
      }

      req.headers["id"] = decoded.id || decoded.userID;
      next();
    });
  } catch (e) {
    return res.status(400).json({
      message: "Something went wrong.",
    });
  }
};

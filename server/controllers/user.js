const { verify } = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    reqBody = req.body;
    let { username, password, email, birthday } = reqBody;

    await User.createUser(
      username,
      password,
      email,
      birthday,
      function (err, admin) {
        if (err) {
          return res.status(400).json({
            message: err,
          });
        } else {
          return res.status(201).json({
            status: "success",
            message: "User created successfully.",
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong. Please,try again.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne(
      { email },
      { hashedPassword: 1, userID: 1, confirmed: 1 }
    ).lean();
    if (!user)
      return res.status(400).json({
        message: "User with this email does not exist!",
      });

    User.authorize(email, password, function (err, user) {
      if (err) {
        return res.status(401).json({
          message: err,
        });
      } else {
        const payload = {
          id: user._id,
        };

        const token = authService.signPayload(payload, "24h");
        return res.status(201).json({
          accessToken: `Bearer ${token}`,
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong. Please,try again.",
    });
  }
};

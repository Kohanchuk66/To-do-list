const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const async = require("async");

dotenv.config();

userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, `Provide a valid e-mail`],
  },
  role: {
    type: String,
    enum: ["user", "manager", "admin"],
    default: "user",
  },
  hashedPassword: {
    type: String,
    minlength: 8,
    select: false,
  },
  birthday: {
    type: Date,
  },
});

userSchema
  .virtual("password")

  .set(function (password) {
    this.hashedPassword = this.encryptPassword(password);
  })

  .get(function () {
    return "Top secret!";
  });

userSchema.methods = {
  encryptPassword: function (password) {
    return bcrypt.hashSync(password, 10);
  },
  checkPassword: function (password) {
    return bcrypt.compareSync(password, this.hashedPassword);
  },
};

userSchema.statics = {
  authorize: function (email, password, callback) {
    let User = this;

    async.waterfall(
      [
        function (callback) {
          if (email) {
            User.findOne({ email }, { hashedPassword: 1 }, callback);
          }
        },
        function (user, callback) {
          if (user && user.checkPassword(password)) {
            callback(null, user);
          } else {
            callback("Wrong password!");
          }
        },
      ],
      callback
    );
  },
  createUser: function (username, password, email, birthday, callback) {
    let User = this;

    let nameFilter = /^([a-zA-Z0-9_\-])+$/;
    let passFilter = /^[a-zA-Z0-9,!,%,&,@,#,$,\^,*,?,_,~,+]*$/;

    async.waterfall(
      [
        function (callback) {
          if (!nameFilter.test(username)) {
            callback("Username must contains only digits or letters");
          } else {
            callback(null);
          }
        },
        function (callback) {
          if (!passFilter.test(password) || password.length < 4) {
            callback("Password length must be more than 4 symbols");
          } else {
            callback(null);
          }
        },
        function (callback) {
          User.findOne({ username }, function (err, user) {
            if (user) {
              callback("User already exists");
            } else {
              callback(null);
            }
          });
        },
      ],
      function (err) {
        if (err) {
          callback(err);
        } else {
          let user = new User({
            username,
            password,
            email,
            birthday,
          });

          user.save(function (err) {
            if (err) return callback(err);
            callback(null, user);
          });
        }
      }
    );
  },
};

module.exports = model("User", userSchema);

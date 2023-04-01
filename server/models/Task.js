const { model, Schema } = require("mongoose");

taskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
});

module.exports = new model("Task", taskSchema);

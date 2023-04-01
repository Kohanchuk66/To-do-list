const express = require("express");

const taskController = require("../controllers/task");
const protector = require("../middlewares/protect.middleware");

const router = express.Router();

router
  .route("/")
  .get(protector.protect, taskController.getAll)
  .post(protector.protect, taskController.create);

router.route("/:id").delete(protector.protect, taskController.delete);

module.exports = router;

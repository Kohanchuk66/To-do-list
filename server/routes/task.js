const express = require('express');

const taskController = require("../controllers/task");

const router = express.Router();

router.route('/')
    .get(taskController.getAll)
    .post(taskController.create);
   
router.route('/:id')
    .delete(taskController.delete);

module.exports = router;
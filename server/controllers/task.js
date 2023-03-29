const Task = require("../models/Task");

exports.getAll = async (req, res) =>{
    try {

        const tasks = await Task.find();

        return res.status(200).json({
            tasks
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong. Please,try again.'
        });
    }
}

exports.create = async (req, res) =>{
    try {
        const {name, endDate, startDate} = req.body;

        const newTask = new Task({name, endDate, startDate});
        newTask.save();

        const tasks = await Task.find();

        return res.status(201).json({
            tasks
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong. Please,try again.'
        });
    }
}

exports.delete = async (req, res) =>{
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);
        
        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            })
        }

        await Task.findOneAndDelete({_id: taskId})

        const tasks = await Task.find();

        return res.status(201).json({
            tasks
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Something went wrong. Please,try again.'
        });
    }
}
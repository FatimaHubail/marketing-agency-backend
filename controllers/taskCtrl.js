const  Task = require('../models/task');

const getTasks = async(req,res)=>{
    try{
        const tasks = await Task.find();

        res.status(200).json(tasks);
    }catch(err){
        res.status(500).json({err: err.message})
    }
}

const createTask = async(req,res)=>{
    try{
        const task = await Task.create(req.body);
        res.status(201).json(task);

    }catch(err){
        res.status(500).json({err: err.message});
    }
}

const updateTask = async(req,res)=>{
    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!task){
            return res.status(404).json({err: 'Task not found'});
        }
        
        res.status(200).json(task);
        
    }catch(err){
        res.status(500).json({err: err.message})
    }
}

const deleteTask = async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id);

        if(!task){
            return res.status(404).json({err: 'Task not found'});
        }

        res.status(200).json({message: 'Task deleted successfully'});

    }catch(err){
        res.status(500).json({err: err.message});
    }
}

module.exports = {
    getTasks, createTask, updateTask, deleteTask,
}
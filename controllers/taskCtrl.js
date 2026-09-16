const  Task = require('../models/task');
const Campaign = require('../models/campaign');
const CampaignRequest = require('../models/campaignRequest');
const Staff = require('../models/staff');
const Outsource = require('../models/outSource');
const { OUTSOURCE_ONLY_TYPES } = require('../constants/campaignTaxonomy');

const getTasks = async(req,res)=>{
    try{
        let filter = {};

        if(req.user.role === 'staff'){
            const staff = await Staff.findOne({
                userId: req.user._id
            });

            if(!staff){
                return res.status(404).json({
                    err: 'Staff profile not found'
                });
            }

            filter.assignedTo = staff._id;
            filter.assignedToType = 'Staff';
        }

        if(req.user.role === 'outsource'){
            filter.assignedTo = req.outsource._id;
            filter.assignedToType = 'Outsource';
        }

        const tasks = await Task.find(filter)
            .populate({
                path: 'campaignId',
                populate: {
                    path: 'requestId'
                }
            })
            .populate({
                path: 'assignedTo',
                populate: {
        path: 'userId',
        select: 'username email'
    }
            })
            .populate({
                path: 'assignedBy',
                select: 'username email'
            });

        res.status(200).json(tasks);

    }catch(err){
        res.status(500).json({
            err: err.message
        });
    }
}

const createTask = async(req,res)=>{
    try{
        if(req.user.role !== 'staff'){
            return res.status(403).json({
                err: 'Only staff can create tasks'
            });
        }

        const staff = await Staff.findOne({
            userId: req.user._id
        });

        if(!staff){
            return res.status(404).json({
                err: 'Staff profile not found'
            });
        }

        const { campaignId } = req.body;

        const campaign = await Campaign.findById(campaignId);

        if(!campaign){
            return res.status(404).json({
                err: 'Campaign not found'
            });
        }

        const campaignRequest = await CampaignRequest.findById(
            campaign.requestId
        );

        if(
            campaignRequest &&
            OUTSOURCE_ONLY_TYPES.includes(campaignRequest.campaignType)
        ){
            return res.status(400).json({
                err: `campaignType '${campaignRequest.campaignType}' must be handled by an outsource partner`
            });
        }

        if(
            campaignRequest &&
            staff.specialty !== campaignRequest.campaignType
        ){
            return res.status(400).json({
                err: `You do not specialize in '${campaignRequest.campaignType}'`
            });
        }

        const task = await Task.create({
            ...req.body,
            assignedTo: staff._id,
            assignedToType: 'Staff',
            assignedBy: req.user._id
        });

        res.status(201).json(task);

    }catch(err){
        res.status(500).json({
            err: err.message
        });
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
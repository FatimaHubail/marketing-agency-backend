const  Task = require('../models/task');
const Campaign = require('../models/campaign');
const CampaignRequest = require('../models/CampaignRequest');
const Staff = require('../models/staff');
const { OUTSOURCE_ONLY_TYPES } = require('../constants/campaignTaxonomy');

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
        const { campaignId, assignedTo } = req.body;

        const campaign = await Campaign.findById(campaignId);
        if(!campaign){
            return res.status(404).json({err: 'Campaign not found'});
        }

        const campaignRequest = await CampaignRequest.findById(campaign.requestId);

        if(campaignRequest && OUTSOURCE_ONLY_TYPES.includes(campaignRequest.campaignType)){
            return res.status(400).json({err: `campaignType '${campaignRequest.campaignType}' must be handled by an outsource partner, not in-house staff`});
        }

        const staff = await Staff.findById(assignedTo);
        if(!staff){
            return res.status(404).json({err: 'Staff member not found'});
        }

        if(campaignRequest && !staff.specialties.includes(campaignRequest.campaignType)){
            return res.status(400).json({err: `Staff member does not specialize in '${campaignRequest.campaignType}'`});
        }

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
const CampaignRequest = require('../models/CampaignRequest');
const Campaign = require('../models/campaign');
const Staff = require('../models/staff');
const OutSource = require('../models/outSource');
const { OUTSOURCE_ONLY_TYPES } = require('../constants/campaignTaxonomy');

const getCampaignRequests = async(req,res)=>{
    try{
        const campaignRequests = await CampaignRequest.find();

        res.status(200).json(campaignRequests);
    }catch(err){
        res.status(500).json({err: err.message});
    }
}

const getCampaignRequest = async(req,res)=>{
    try{
        const campaignRequest = await CampaignRequest.findById(req.params.id);

        if(!campaignRequest){
            return res.status(404).json({err: 'Campaign request not found'});
        }

        res.status(200).json(campaignRequest);

    }catch(err){
        res.status(500).json({err: err.message});
    }
}

const updateCampaignRequest = async(req,res)=>{
    try{
        const campaignRequest = await CampaignRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        if(!campaignRequest){
            return res.status(404).json({err: 'Campaign request not found'});
        }

        res.status(200).json(campaignRequest);

    }catch(err){

        if(err.name === 'ValidationError'){
            return res.status(400).json({err: err.message});
        }
        res.status(500).json({err: err.message});
    }
}


const rejectCampaignRequest = async(req,res)=>{
    try{
        const campaignRequest = await CampaignRequest.findById(req.params.id);

        if(!campaignRequest){
            return res.status(404).json({err: 'Campaign request not found'});
        }

        if(campaignRequest.status === 'accepted' || campaignRequest.status === 'rejected'){
            return res.status(400).json({err: `Request has already been ${campaignRequest.status}`});
        }

        campaignRequest.status = 'rejected';
        campaignRequest.rejectedReason = req.body.rejectedReason;

        await campaignRequest.save();

        res.status(200).json(campaignRequest);

    }catch(err){
        if(err.name === 'ValidationError'){
            return res.status(400).json({err: err.message});
        }

        res.status(500).json({err: err.message});
    }
}

const assignCampaignRequest = async(req,res)=>{
    try{
        const campaignRequest = await CampaignRequest.findById(req.params.id);

        if(!campaignRequest){
            return res.status(404).json({err: 'Campaign request not found'});
        }

        if(campaignRequest.status === 'accepted' || campaignRequest.status === 'rejected'){
            return res.status(400).json({err: `Request has already been ${campaignRequest.status}`});
        }

        const { staffId, outsourceId, startDate, endDate } = req.body;

        if(!startDate || !endDate){
            return res.status(400).json({err: 'startDate and endDate are required'});
        }

        
        const isOutsourceOnly = OUTSOURCE_ONLY_TYPES.includes(campaignRequest.campaignType);

        if(isOutsourceOnly){
            if(staffId){
                return res.status(400).json({err: `campaignType '${campaignRequest.campaignType}' must be assigned to an outsource partner, not in-house staff`});
            }

            if(!outsourceId){
                return res.status(400).json({err: 'outsourceId is required'});
            }

            const outsource = await OutSource.findOne({ userId: outsourceId });
            if(!outsource){
                return res.status(404).json({err: 'Outsource partner not found'});
            }
            if(!outsource.serviceTypes.includes(campaignRequest.campaignType)){
                return res.status(400).json({err: `Outsource partner does not provide '${campaignRequest.campaignType}' services`});
            }
        } else {
            if(outsourceId){
                return res.status(400).json({err: `campaignType '${campaignRequest.campaignType}' must be assigned to in-house staff, not an outsource partner`});
            }

            if(!staffId){
                return res.status(400).json({err: 'staffId is required'});
            }

            const staff = await Staff.findOne({ userId: staffId });
            if(!staff){
                return res.status(404).json({err: 'Staff member not found'});
            }
            if(!staff.specialties.includes(campaignRequest.campaignType)){
                return res.status(400).json({err: `Staff member does not specialize in '${campaignRequest.campaignType}'`});
            }
        }

        const campaign = await Campaign.create({
            requestId: campaignRequest._id,
            assignedStaffId: staffId || undefined,
            outsourcePartnerId: outsourceId || undefined,
            startDate,
            endDate,
        });

        campaignRequest.status = 'accepted';
        await campaignRequest.save();

        res.status(201).json({ campaignRequest, campaign });

    }catch(err){
        res.status(500).json({err: err.message});
    }
}

const deleteCampaignRequest = async(req,res)=>{
    try{
        const campaignRequest = await CampaignRequest.findByIdAndDelete(req.params.id);

        if(!campaignRequest){
            return res.status(404).json({err: 'Campaign request not found'});
        }

        res.status(200).json({
            message: 'Campaign request deleted successfully'
        });

    }catch(err){
        res.status(500).json({err: err.message});
    }
}

module.exports = {
    getCampaignRequests,
    getCampaignRequest,
    updateCampaignRequest,
    assignCampaignRequest,
    deleteCampaignRequest
}
const CampaignRequest = require('../models/campaignRequest');

const allRequests = async(req,res)=> {
    try{
        const campaignRequests = await CampaignRequest.find();

        res.status(200).json(campaignRequests);
    }catch(err){
        res.status(500).json({err: err.message})
    }
}

const show = async(req,res)=>{
    try{
        const campaignRequestOne = await CampaignRequest.findById(req.params.id);

        res.status(200).json(campaignRequestOne);
    }catch(err){
        res.status(500).json({err: err.message});

    }
}

const update = async(req,res)=>{
  try{
    const campaignRequest = await CampaignRequest.findByIdAndUpdate(req.params.id, req.body,
    {new: true}
    );
    if(!campaignRequest){
      return res.status(400).json({err: 'Campaign request not found'});
    }

    res.status(200).json(campaignRequest);
  }
  catch(err){
    res.status(500).json({err: err.message})
  }
}

const deleteCampaignRequest = async(req,res)=>{
  try{
    const campaignRequest = await CampaignRequest.findByIdAndDelete(req.params.id);

    if(!campaignRequest){
      return res.status(404).json({err: 'Campaign request not found'});
    }
    res.status(200).json({message: 'Campaign request deleted successfully'});
  }catch(err){
    res.status(500).json({err: err.message});
  }
}
module.exports = {
  allRequests,
  show,
  update,
  delete: deleteCampaignRequest,
};
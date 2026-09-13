const CampaignRequest = require('../models/campaignRequest');

const createCampReq = async (req, res) => {
  try {
    const campaignRequest = await CampaignRequest.create(req.body);

    res.status(201).json(campaignRequest);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

const getCampaignRequest = async(req,res)=> {
    try{
        const campaignRequests = await CampaignRequest.find();

        res.status(200).json(campaignRequests);
    }catch(err){
        res.status(500).json({err: err.message})
    }
}

const getOneCampaignRequest = async(req,res)=>{
    try{
        const campaignRequestOne = await CampaignRequest.findById(req.params.id);

        res.status(200).json(campaignRequestOne);
    }catch(err){
        res.status(500).json({err: err.message});

    }
}

module.exports = {
  createCampReq, getCampaignRequest, getOneCampaignRequest,
};
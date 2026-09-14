const CampaignRequest = require('../models/campaignRequest');


const create = async (req, res) => {
    try {
        const { title, description, campaignType, goal, notes, budget, preferredChannels } = req.body;

        const newRequest = await CampaignRequest.create({
            clientId: req.user.clientId,
            title,
            description,
            campaignType,
            goal,
            notes,
            budget,
            preferredChannels,
            status: 'submitted',
        });

        res.status(201).json(newRequest);
    } catch (err) {
        res.status(400).json({ err: err.message });
    }
};

const allRequests = async (req, res) => {
    try {
        const campaignRequests = await CampaignRequest.find({clientId: req.user.clientId}).sort({createdAt: -1});

        res.status(200).json(campaignRequests);
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const show = (req, res) => {
    // req.campaignRequest was loaded + ownership-checked by middleware
    res.status(200).json(req.campaignRequest);
};


const update = async (req, res) => {
    try {
        const { title, description, campaignType, goal, notes, budget, preferredChannels } = req.body;

        Object.assign(req.campaignRequest, {
            title, description, campaignType, goal, notes, budget, preferredChannels,
        });

        await req.campaignRequest.save();

        res.status(200).json(req.campaignRequest);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const deleteCampaignRequest = async (req, res) => {
    try {
        await req.campaignRequest.deleteOne();

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}
module.exports = {
    create,
    allRequests,
    show,
    update,
    delete: deleteCampaignRequest,
};
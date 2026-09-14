const CampaignRequest = require('../models/campaignRequest');
const { CAMPAIGN_TYPES, GOALS_BY_TYPE } = require('../constants/campaignTaxonomy');

const create = async (req, res) => {
    try {
        const { title, description, campaignType, goal, notes, budget, preferredChannels } = req.body;

        // validating campaign request fields
        if (!title || !campaignType || !goal || budget === undefined) {
            return res.status(400).json({ error: 'title, campaignType, goal, and budget are required' });
        }

        if (!CAMPAIGN_TYPES.includes(campaignType)) {
            return res.status(400).json({ error: 'invalid campaignType' });
        }

        if (!GOALS_BY_TYPE[campaignType].includes(goal)) {
            return res.status(400).json({ error: `invalid goal for campaignType '${campaignType}'` });
        }

        if (typeof budget !== 'number' || budget < 0) {
            return res.status(400).json({ error: 'budget must be a non-negative number' });
        }

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
    } catch (error) {
        res.status(400).json({ err: error.message });
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

const show = async (req, res) => {
    try {
        const campaignRequest = await CampaignRequest.findById(req.params.id);

        if (!campaignRequest) {
            return res.status(404).json({ err: 'Request not found' });
        }

        if (campaignRequest.clientId.toString() !== req.user.clientId) {
            return res.status(403).json({ err: 'Not authorized to view this request' });
        }

        if (campaignRequest.status !== 'submitted') {
            return res.status(400).json({ err: 'Request can no longer be edited once it is under review' });
        }
        
        res.status(200).json(campaignRequestOne);
    } catch (err) {
        res.status(500).json({ err: err.message });

    }
}

const update = async (req, res) => {
    try {
        const campaignRequest = await CampaignRequest.findByIdAndUpdate(req.params.id, req.body,
            { new: true }
        );
        if (!campaignRequest) {
            return res.status(400).json({ err: 'Campaign request not found' });
        }

        res.status(200).json(campaignRequest);
    }
    catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const deleteCampaignRequest = async (req, res) => {
    try {
        const campaignRequest = await CampaignRequest.findByIdAndDelete(req.params.id);

        if (!campaignRequest) {
            return res.status(404).json({ err: 'Campaign request not found' });
        }
        res.status(200).json({ message: 'Campaign request deleted successfully' });
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
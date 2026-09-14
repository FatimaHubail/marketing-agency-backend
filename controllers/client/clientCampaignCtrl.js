const Campaign = require('../../models/campaign');
const CampaignRequest = require('../../models/CampaignRequest');

const DECISION_STATUS = {
    approved: 'live',
    changes_requested: 'in_progress',
};

const allCampaigns = async (req, res) => {
    try {
        const requestIds = await CampaignRequest.find({ clientId: req.user.clientId }).distinct('_id');

        const campaigns = await Campaign.find({ requestId: { $in: requestIds } })
            .populate('requestId')
            .sort({ startDate: -1 });

        res.status(200).json(campaigns);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

const show = (req, res) => {
    // req.campaign was loaded + ownership-checked by isCampaignOwner middleware
    res.status(200).json(req.campaign);
};

const review = async (req, res) => {
    try {
        const { decision } = req.body;

        if (!decision) {
            return res.status(400).json({ err: 'decision is required' });
        }

        const nextStatus = DECISION_STATUS[decision];

        if (!nextStatus) {
            return res.status(400).json({ err: `decision must be one of: ${Object.keys(DECISION_STATUS).join(', ')}` });
        }

        req.campaign.status = nextStatus;
        await req.campaign.save();

        res.status(200).json(req.campaign);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = {
    allCampaigns,
    show,
    review,
};

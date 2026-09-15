const Campaign = require('../models/campaign');
const CampaignRequest = require('../models/CampaignRequest');

// Staff-driven forward progress: planning -> in_progress -> client_review,
// and live -> completed. client_review -> live/in_progress is the client's
// call (see reviewCampaign), not staff's.
const STAFF_TRANSITIONS = {
    planning: 'in_progress',
    in_progress: 'client_review',
    live: 'completed',
};

const REVIEW_DECISION_STATUS = {
    approved: 'live',
    changes_requested: 'in_progress',
};

const getCampaigns = async (req, res) => {
    try {
        if (req.user.role === 'client') {
            const requestIds = await CampaignRequest.find({ clientId: req.user.clientId }).distinct('_id');
            const campaigns = await Campaign.find({ requestId: { $in: requestIds } })
                .populate('requestId')
                .sort({ startDate: -1 });

            return res.status(200).json(campaigns);
        }

        if (req.user.role === 'outsource') {
            const campaigns = await Campaign.find({ outsourcePartnerId: req.user._id })
                .populate('requestId')
                .sort({ startDate: -1 });

            return res.status(200).json(campaigns);
        }

        if (req.user.role === 'staff' || req.user.role === 'admin') {
            const campaigns = await Campaign.find().populate('requestId').sort({ startDate: -1 });
            return res.status(200).json(campaigns);
        }

        res.status(403).json({ err: 'Access denied' });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}


const getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate('requestId');

        if (!campaign) {
            return res.status(404).json({ err: 'Campaign not found' });
        }

        if (req.user.role === 'client') {
            if (!campaign.requestId || campaign.requestId.clientId.toString() !== req.user.clientId) {
                return res.status(403).json({ err: 'Not authorized to access this campaign' });
            }
        }
        // Allow outsource to fetch the campaign data that they particepated in
        else if (req.user.role === 'outsource') {
            if (!campaign.outsourcePartnerId || campaign.outsourcePartnerId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ err: 'Not authorized to access this campaign' });
            }
        } else if (req.user.role !== 'staff' && req.user.role !== 'admin') {
            return res.status(403).json({ err: 'Access denied' });
        }

        res.status(200).json(campaign);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

// The client's approve / request-changes decision, only while the campaign
// is awaiting their review.
const reviewCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate('requestId');

        if (!campaign) {
            return res.status(404).json({ err: 'Campaign not found' });
        }

        if (!campaign.requestId || campaign.requestId.clientId.toString() !== req.user.clientId) {
            return res.status(403).json({ err: 'Not authorized to access this campaign' });
        }

        if (campaign.status !== 'client_review') {
            return res.status(403).json({ err: `Campaign can only be reviewed while in 'client_review' status` });
        }

        const { decision } = req.body;

        if (!decision) {
            return res.status(400).json({ err: 'decision is required' });
        }

        const nextStatus = REVIEW_DECISION_STATUS[decision];
        if (!nextStatus) {
            return res.status(400).json({ err: `decision must be one of: ${Object.keys(REVIEW_DECISION_STATUS).join(', ')}` });
        }

        campaign.status = nextStatus;
        await campaign.save();

        res.status(200).json(campaign);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

const advanceCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ err: 'Campaign not found' });
        }

        const nextStatus = STAFF_TRANSITIONS[campaign.status];
        if (!nextStatus) {
            return res.status(400).json({ err: `Campaign in '${campaign.status}' cannot be advanced by staff` });
        }

        campaign.status = nextStatus;
        await campaign.save();

        res.status(200).json(campaign);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

module.exports = {
    getCampaigns,
    getCampaign,
    reviewCampaign,
    advanceCampaign,
};

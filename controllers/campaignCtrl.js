const Campaign = require('../models/campaign');
const CampaignRequest = require('../models/campaignRequest');

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

// Staff marks a campaign done once its work is finished. Only meaningful
// once work has actually started - a still-empty (pending) campaign has
// nothing to complete.
const completeCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ err: 'Campaign not found' });
        }

        if (campaign.status !== 'in_progress') {
            return res.status(400).json({ err: `Campaign in '${campaign.status}' cannot be marked as completed` });
        }

        campaign.status = 'completed';
        await campaign.save();

        res.status(200).json(campaign);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

module.exports = {
    getCampaigns,
    getCampaign,
    completeCampaign,
};

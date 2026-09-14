const Campaign = require('../models/campaign');

function isCampaignOwner({ status } = {}) {
    return async (req, res, next) => {
        try {
            const campaign = await Campaign.findById(req.params.id).populate('requestId');

            if (!campaign) {
                return res.status(404).json({ err: 'Campaign not found' });
            }

            if (!campaign.requestId || campaign.requestId.clientId.toString() !== req.user.clientId) {
                return res.status(403).json({ err: 'Not authorized to access this campaign' });
            }

            if (status && campaign.status !== status) {
                return res.status(403).json({ err: `Campaign can only be reviewed while in '${status}' status` });
            }

            req.campaign = campaign;
            next();
        } catch (err) {
            res.status(500).json({ err: err.message });
        }
    };
}

module.exports = isCampaignOwner;

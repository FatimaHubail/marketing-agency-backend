const CampaignRequest = require('../models/CampaignRequest');

function isOwner({ status } = {}) {
    return async (req, res, next) => {
        try {
            const campaignRequest = await CampaignRequest.findById(req.params.id);

            if (!campaignRequest) {
                return res.status(404).json({ err: 'Request not found' });
            }

            if (campaignRequest.clientId.toString() !== req.user.clientId) {
                return res.status(403).json({ err: 'Not authorized to access this request' });
            }

            if (status && campaignRequest.status !== status) {
                return res.status(409).json({ err: `Request can no longer be edited once it is under review` });
            }

            req.campaignRequest = campaignRequest;
            next();
        } catch (err) {
            res.status(500).json({ err: err.message });
        }
    };
}

module.exports = isOwner;
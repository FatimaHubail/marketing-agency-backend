const { CAMPAIGN_TYPES, GOALS_BY_TYPE, PREFERRED_CHANNELS } = require('../constants/campaignTaxonomy');

function validateFields(req, res, next) {
    const { title, campaignType, goal, budget, preferredChannels } = req.body;

    if (!title || !campaignType || !goal || budget === undefined) {
        return res.status(400).json({ err: 'title, campaignType, goal, and budget are required' });
    }

    if (!CAMPAIGN_TYPES.includes(campaignType)) {
        return res.status(400).json({ err: 'invalid campaignType' });
    }

    if (!GOALS_BY_TYPE[campaignType].includes(goal)) {
        return res.status(400).json({ err: `invalid goal for campaignType '${campaignType}'` });
    }

    if (typeof budget !== 'number' || budget < 0) {
        return res.status(400).json({ err: 'budget must be a non-negative number' });
    }

    if (preferredChannels !== undefined) {
        if (!Array.isArray(preferredChannels)) {
            return res.status(400).json({ err: 'preferredChannels must be an array' });
        }

        const invalidChannel = preferredChannels.find((channel) => !PREFERRED_CHANNELS.includes(channel));
        if (invalidChannel) {
            return res.status(400).json({ err: `invalid preferredChannel '${invalidChannel}'` });
        }
    }

    next();
}

module.exports = validateFields;
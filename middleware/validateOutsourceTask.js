const { CAMPAIGN_TYPES } = require('../constants/campaignTaxonomy');


function validateOutsourceTask(req, res, next) {
    const { title, serviceType, paymentAmount, dueDate, outsourceId } = req.body;

    if (!title || !serviceType || paymentAmount === undefined || !dueDate || !outsourceId) {
        return res.status(400).json({
            err: 'The title of the task, type of  the service, amount of payment, and due Date are required'
        });
    }

    if (!CAMPAIGN_TYPES.includes(serviceType)) {
        return res.status(400).json({ err: `invalid serviceType '${serviceType}'` });
    }

    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ err: 'invalid Date' });
    }

    next();
}

module.exports = validateOutsourceTask;
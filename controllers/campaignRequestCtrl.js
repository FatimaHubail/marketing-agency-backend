const CampaignRequest = require('../models/campaignRequest');
const Campaign = require('../models/campaign');
const Staff = require('../models/staff');
const OutSource = require('../models/outSource');
const Client = require('../models/client');
const User = require('../models/user');

const { OUTSOURCE_ONLY_TYPES } = require('../constants/campaignTaxonomy');

const getStaffProfile = async (userId) => {
    return await Staff.findOne({
        userId
    });
};


const getCampaignRequests = async (req, res) => {
    try {
        const staff = await getStaffProfile(req.user._id);

        if (!staff) {
            return res.status(404).json({
                err: 'Staff profile not found'
            });
        }

        const campaignRequests = await CampaignRequest.find({
            campaignType: staff.specialty
        });

        const requests = await Promise.all(
            campaignRequests.map(async (request) => {
                if (!request.clientId) {
                    return request;
                }

                const client = await Client.findById(request.clientId);

                if (!client) {
                    return request;
                }

                const user = await User.findById(client.user);

                return {
                    ...request.toObject(),
                    clientId: {
                        ...client.toObject(),
                        user: user
                    }
                };
            })
        );

        res.status(200).json(requests);

    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
};


const getCampaignRequest = async (req, res) => {
    try {
        const staff = await getStaffProfile(req.user._id);

        if (!staff) {
            return res.status(404).json({
                err: 'Staff profile not found'
            });
        }

        const campaignRequest = await CampaignRequest.findOne({
            _id: req.params.id,
            campaignType: staff.specialty
        });

        if (!campaignRequest) {
            return res.status(404).json({
                err: 'Campaign request not found'
            });
        }

        res.status(200).json(campaignRequest);

    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
};


// Status is intentionally not editable here.
// It only moves via assignCampaignRequest or rejectCampaignRequest.
const EDITABLE_REQUEST_FIELDS = [
    'title',
    'description',
    'campaignType',
    'goal',
    'notes',
    'budget',
    'preferredChannels'
];


const updateCampaignRequest = async (req, res) => {
    try {
        const campaignRequest = await CampaignRequest.findById(req.params.id);

        if (!campaignRequest) {
            return res.status(404).json({
                err: 'Campaign request not found'
            });
        }

        for (const field of EDITABLE_REQUEST_FIELDS) {
            if (req.body[field] !== undefined) {
                campaignRequest[field] = req.body[field];
            }
        }

        await campaignRequest.save();

        res.status(200).json(campaignRequest);

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                err: err.message
            });
        }

        res.status(500).json({
            err: err.message
        });
    }
};


const rejectCampaignRequest = async (req, res) => {
    try {
        const staff = await getStaffProfile(req.user._id);

        if (!staff) {
            return res.status(404).json({
                err: 'Staff profile not found'
            });
        }

        const campaignRequest = await CampaignRequest.findOne({
            _id: req.params.id,
            campaignType: staff.specialty
        });

        if (!campaignRequest) {
            return res.status(404).json({
                err: 'Campaign request not found'
            });
        }

        if (
            campaignRequest.status === 'accepted' ||
            campaignRequest.status === 'rejected'
        ) {
            return res.status(400).json({
                err: `Request has already been ${campaignRequest.status}`
            });
        }

        campaignRequest.status = 'rejected';
        campaignRequest.rejectedReason = req.body.rejectedReason;

        await campaignRequest.save();

        res.status(200).json(campaignRequest);

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                err: err.message
            });
        }

        res.status(500).json({
            err: err.message
        });
    }
};


const assignCampaignRequest = async (req, res) => {
    try {
        const staff = await getStaffProfile(req.user._id);

        if (!staff) {
            return res.status(404).json({
                err: 'Staff profile not found'
            });
        }

        const campaignRequest = await CampaignRequest.findOne({
            _id: req.params.id,
            campaignType: staff.specialty
        });

        if (!campaignRequest) {
            return res.status(404).json({
                err: 'Campaign request not found'
            });
        }

        if (
            campaignRequest.status === 'accepted' ||
            campaignRequest.status === 'rejected'
        ) {
            return res.status(400).json({
                err: `Request has already been ${campaignRequest.status}`
            });
        }

        const {
            startDate,
            endDate
        } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({
                err: 'startDate and endDate are required'
            });
        }

        const isOutsourceOnly = OUTSOURCE_ONLY_TYPES.includes(
            campaignRequest.campaignType
        );

        if (isOutsourceOnly) {
            return res.status(400).json({
                err: `campaignType '${campaignRequest.campaignType}' must be handled by an outsource partner`
            });
        }

        const campaign = await Campaign.create({
            requestId: campaignRequest._id,
            assignedStaffId: staff._id,
            startDate,
            endDate
        });

        campaignRequest.status = 'accepted';

        await campaignRequest.save();

        res.status(201).json({
            campaignRequest,
            campaign
        });

    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
};


const deleteCampaignRequest = async (req, res) => {
    try {
        const campaignRequest = await CampaignRequest.findByIdAndDelete(
            req.params.id
        );

        if (!campaignRequest) {
            return res.status(404).json({
                err: 'Campaign request not found'
            });
        }

        res.status(200).json({
            message: 'Campaign request deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
};


module.exports = {
    getCampaignRequests,
    getCampaignRequest,
    updateCampaignRequest,
    assignCampaignRequest,
    rejectCampaignRequest,
    deleteCampaignRequest
};
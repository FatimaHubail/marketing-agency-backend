const Client = require('../models/client');

const ALLOWED_PROFILE_FIELDS = [
    'companyName', 'industry', 'contactPerson', 'contactEmail', 'contactPhone',
    'preferredContactMethod', 'website', 'socialMediaPlatforms',
    'targetAudience', 'guideLinesUrl', 'budgetTier', 'address',
];

const getClients = async(req,res)=>{
    try{
        const client = await Client.find();

        res.status(200).json(client);

    }catch(err){
        res.status(500).json({err: err.message});
    }
}

const getClient = async(req,res)=>{
    try{
        if(req.params.id !== req.user.clientId){
            return res.status(404).json({err: 'Client profile not found'});
        }

        const client = await Client.findById(req.params.id);

        if(!client){
            return res.status(404).json({err: 'Client profile not found'});
        }

        res.status(200).json(client);

    }catch(err){
        res.status(500).json({err: err.message})
    }
}

const updateClient = async(req,res)=>{
    try{
        if(req.params.id !== req.user.clientId){
            return res.status(404).json({err: 'Client profile not found'});
        }

        const client = await Client.findById(req.params.id);

        if(!client){
            return res.status(404).json({err: 'Client profile not found'});
        }

        for(const field of ALLOWED_PROFILE_FIELDS){
            if(req.body[field] !== undefined){
                client[field] = req.body[field];
            }
        }

        await client.save();

        res.status(200).json(client);

    }catch(err){
        if(err.name === 'ValidationError'){
            return res.status(400).json({err: err.message});
        }
        res.status(500).json({err: err.message});
    }
}

const deleteClient = async(req,res)=>{
    try{
        const client = await Client.findByIdAndDelete(req.params.id);

        if(!client){
            return res.status(404).json({err: 'Client not found'});
        }

        res.status(200).json({
            message: 'Client deleted successfully'
        })

    }catch(err){
        res.status(500).json({err: err.message});
    }
}

module.exports = {
    getClients, getClient, updateClient, deleteClient,
}
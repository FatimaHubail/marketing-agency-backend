const Client = require('../models/client');

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
        const client = await Client.findById(req.params.id);

        if(!client){
            return res.status(404).json({err: 'Client not found'});
        }

        res.status(200).json(client);

    }catch(err){
        res.status(500).json({err: err.message})
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
    getClients, getClient, /*updateClient,*/ deleteClient,
}
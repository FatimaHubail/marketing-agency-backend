const Client = require('../models/client');

const getClients = async(req,res)=>{
    try{
        const client = await Client.find();

        res.status(200).json(client);

    }catch(err){
        res.status(500).json({err: err.message});
    }
}

module.exports = {
    getClients, 
}
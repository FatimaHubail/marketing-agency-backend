const express = require ('express');
const router = express.Router();

const Department = require('../models/department');

router.post('/', async (req,res)=>{
    try{

    }catch(err){
        res.status(500).json({err: error.message});
    }
});

module.exports = router;
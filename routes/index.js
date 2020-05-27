const express = require('express');

const router = express.Router();

const {ensureAuthenticate} = require('../config/auth');


router.get('/', function(req, res){
    res.render('welcome');
})


router.get('/dashboard',ensureAuthenticate ,function(req, res){
    res.render('dashboard',{
        name:req.user.name
    });
})



module.exports=router;
const express = require('express');
let router = express.Router();

let GameRoom = require('../models/GameRoom');

//Get Homepage
router.get('/', function(req,res){
    res.render('index');
});

router.get('/client', (req, res) => {
    res.render('client');
});


module.exports = router;
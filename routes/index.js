var express = require('express');
var router = express.Router();

//Get Homepage
router.get('/', function(req,res){
    res.render('index');
});

router.get('/client', (req, res) => {
    res.render('client');
});

module.exports = router;
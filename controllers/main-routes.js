const express = require('express');
const router = express.Router();

// Get Homepage
router.get('/', (req,res) => {
    res.render('index');
});

// Game Room GET (from redirect)
router.get('/rooms/:id', (req, res) => {
    res.render('gameroom');
});

module.exports = router;
const express = require('express');
const router = express.Router();

// Get Homepage
router.get('/', (req,res) => {
    res.render('index');
});

// Create Game POST & redirect
router.post('/create', (req, res) => {

});


// Join Game POST & redirect
router.post('/join/:id', (req, res) => {
    const targetRoom = req.params.id;
    console.log(`Attempting to join Room ${targetRoom}`);
    // check if the room exists
        // accept and join
            // serve redirect
            res.redirect(`/${targetRoom}`);
        // reject and notify
            // serve rejection
});

// Game Room GET (from redirect)
router.get('/:id', (req, res) => {
    res.render('gameroom');
});

module.exports = router;
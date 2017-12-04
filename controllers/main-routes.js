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

// GET for the SSL Cert
router.get('/.well-known/acme-challenge/:content', function(req, res) {
    res.send('kh7pYJ9BTBTPNqML0gwhigLvhmH05Z6ERG8rxrb92oc.BJB6rStNT_6mx9UkTabKe07QyCyvht9E0W2NJbyg7S0')
});

module.exports = router;
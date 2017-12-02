const express = require('express');
const router = express.Router();

// GET Register page
router.get('/register', (req,res) => {
    // All we have to do is serve the register page
    res.render('register');
});

// POST New User to server
router.post('/register', (req,res) => {
    // Pull form data

    // POST form data to the server

    // Check if the User already exits in the DB
        // If so, throw error

        // Else create new User
            // After creation, redirect to the Admin or Dashboard

   const name = req.body.name;
   const email = req.body.email;
   const username = req.body.email;
   const password = req.body.password;
   const password2 = req.body.password2;


   //Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    const errors = req.validationErrors();

    if(errors){
       res.render('register', {
           errors:errors
       });
    } else{

    }

});

// GET Login Page
router.get('/login', (req,res) => {
    // All we have to do is serve the login page
    res.render('login');
});

// POST Login Credentials to server
router.post('/login', (req, res) => {
    // Check if User is valid
        // If they are check their Access Level
            // If Admin server Admin page

            // Else serve User Dashboard

        // Else serve Reject/Register page
        res.render('register');
});


module.exports = router;
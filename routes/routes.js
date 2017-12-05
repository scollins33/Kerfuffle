// Requiring our Todo model
const db = require('../models/db');

// Routes
// =============================================================
module.exports = function(app) {
    // GET route for getting all of the todos
    app.get("/api/qs", function (req, res) {

        // defines the function
      function setQuestions(pNumber) {
            // sets up the vars in the function
            let numQs = pNumber;
            let randomQs = [];
            let entries = 0;
            // does a count() query against the questions table
            qs = db.questions.count();

            // loops the number of times you told it to in the paramter
            for (let i = 0; i < numQs; i++) {

                // get a random number within 0 to the # of entries (from count query)
                let randID = Math.floor(Math.random() + 1);

                // query for the question at the specific ID (the one we just randomly chose)
                thisQ = db.questions.findOne( {where: {id: randID} });
                console.log('what is this', thisQ);
                // add the question object to the array
                randomQs.push(thisQ);

            }
            // after looping, return the array
            return randomQs;
        }
        // run the function and set the return to the variable
        const someQs = setQuestions(10);
        // send the array in the response
        // THIS MIGHT NOT WORK, DONT KNOW IF YOU CAN SEND AN ARRAY WITH RES.JSON
        res.json(someQs);

    });
};
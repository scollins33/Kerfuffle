// Requiring our Todo model
const db = require('../models/db');

// Routes
// =============================================================
module.exports = function(app) {

    // GET route for getting all of the todos
    app.get("/api/qs", function (req, res) {
        // findAll returns all entries for a table when used with no options
        db.questions.findAll({

                limit: 100,

        }).then(function (dbquestions) {
            // We have access to the todos as an argument inside of the callback function
            res.json(dbquestions);

        });
    });
}


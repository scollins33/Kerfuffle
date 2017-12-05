const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get Homepage
router.get('/', (req,res) => {
    res.render('index');
});

// POST route for creating questions
router.post('/admin/create', (req, res) => {
    console.log(req.body);
    db.questions.create({
        question_text: req.body.questionText,
        answer_a: req.body.answerA,
        answer_b: req.body.answerB,
        answer_c: req.body.answerC,
        answer_d: req.body.answerD,
        correct_answer: req.body.correct
    })
        .then(function(dbRes) {
            res.json(dbRes);
        });
});

// DELETE route for deleting questions
router.delete("/admin/delete/:id", (req, res) => {
    db.questions.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(function(dbRes) {
            res.json(dbRes);
        });
});

module.exports = router;
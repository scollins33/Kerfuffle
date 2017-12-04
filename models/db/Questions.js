// Sequelize model for Questions Table
module.exports = function(sequelize, DataTypes) {
    const questions = sequelize.define("questions", {
        question_text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        answer_a: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        },

        answer_b: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        },

        answer_c: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        },

        answer_d: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        },
        correct_answer: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        },

        createdAt: {
            type: DataTypes.STRING,
            allowNull: true,
            len: [1]
        },

        updatedAt: {
            type: DataTypes.STRING,
            allowNull: true,
            len: [1]
        }
    });



    return questions;
};

function populate (queryInterface, sequelize) {

    return [
        queryInterface.bulkInsert('trivia_db.json', [
            {question_text: "question", answer_a: "A", answer_b: "B", answer_c: "C", answer_d: "D", correct_answer: "answer",  createdAt: Date.now(), updatedAt: Date.now()},

        ])
    ];
}
populate();




// Initial Build and sync

// Add

// Edit




// Delete
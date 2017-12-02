var Sequelize = require('sequelize');

// Sequelize model for Questions Table
module.exports = function(sequelize, DataTypes) {
    var qTable = sequelize.define("qTable", {
        question: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        answerList: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        },
        correctAnswer: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [1]
        }
    });

    return qTable;
};

module.exports = db;

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// Initial Build and sync

// Add

// Edit




// Delete
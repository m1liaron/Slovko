const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');
const { v4: uuidv4 } = require('uuid');
const Group = require("./Group");

const Card = sequelize.define(
    'Card',
{
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
    },
    word: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 30],
            notNull: {
                msg: 'Please provide a word',
            },
            notEmpty: {
                msg: 'Card word cannot be empty',
            },
        },
    },
    translateWord: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 30],
            notNull: {
                msg: 'Please provide a translate word',
            },
            notEmpty: {
                msg: 'Card translate word cannot be empty',
            },
        },
    },
    groupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Group,
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('Learned', 'To Learn', 'Know'),
        allowNull: false,
    },
    learnedAt: {
        type: DataTypes.DATE, // Date when the card was learned
        allowNull: true,
    },
    nextReviewAt: {
        type: DataTypes.DATE, // Date for the next review based on the curve
        allowNull: true,
    },
    reviewCount: {
        type: DataTypes.INTEGER, // Number of times the card has been reviewed
        defaultValue: 0,
    }
},
{
        tableName: 'Cards',
        timestamps: true,
});

module.exports = Card;
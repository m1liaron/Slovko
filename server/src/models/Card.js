const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');
const { v4: uuidv4 } = require('uuid');

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
},
{
        tableName: 'Cards',
        timestamps: true,
});

module.exports = Card;
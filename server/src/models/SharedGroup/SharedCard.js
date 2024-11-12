const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sequelize');
const {v4: uuidv4} = require("uuid");
const { SharedGroup } = require("../models");

const SharedCard = sequelize.define("SharedCard", {
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
    sharedGroupId: {
        type: DataTypes.UUID,
        references: {
            model: "SharedGroups",
            key: 'id',
        }
    },
});

module.exports = SharedCard;
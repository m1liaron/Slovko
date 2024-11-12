const {sequelize} = require("../../db/sequelize");
const {DataTypes} = require("sequelize");
const {v4: uuidv4} = require("uuid");
const { ResultMode } = require("../models");

const WordResult = sequelize.define(
    'WordResult',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
        },
        resultModeId: {
            type: DataTypes.UUID,
            references: {
                model: ResultMode,
                key: 'id'
            }
        },
        word: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        translate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mistakesAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }
    }, {
        tableName: 'WordsResult',
        timestamps: true
    }
);

module.exports = WordResult;
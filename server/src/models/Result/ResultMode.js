const {sequelize} = require("../../db/sequelize");
const {DataTypes} = require("sequelize");
const {v4: uuidv4} = require("uuid");
const { Result } = require("../models");

const ResultMode = sequelize.define(
    "ResultMode",
{
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
        },
        mode: {
          type: DataTypes.ENUM('flashCards', 'quiz', 'guessWord'),
          allowNull: false,
        },
        resultId: {
            type: DataTypes.UUID,
            references: {
                model: Result,
                key: 'id'
            }
        }
    },
    {
        tableName: 'ResultsMode',
        timestamps: true
    }
)

module.exports = ResultMode;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');
const { v4: uuidv4 } = require('uuid');
const { User } = require('./models');

const Result = sequelize.define(
    'Result',
{
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        startedLearn: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        completionTime: {
            type: DataTypes.DATE, // For timestamps with timezone
            allowNull: false,
        }
},
{
    tableName: 'Results',
    timestamps: true
});

module.exports = Result;
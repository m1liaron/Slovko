const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');
const { v4: uuidv4 } = require('uuid');

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
                model: 'User',
                key: 'id'
            }
        }
},
{
    tableName: 'Results',
    timestamps: true
});

module.exports = Result;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');
const { v4: uuidv4 } = require('uuid');

const Group = sequelize.define(
    'Group',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
        },
       title: {
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
       }
    },
    {
        tableName: 'Groups',
        timestamps: true,
    });

module.exports = Group;
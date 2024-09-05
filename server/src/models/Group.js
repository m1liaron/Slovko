const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');
const { v4: uuidv4 } = require('uuid');
const User = require('./User');

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
       },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
    },
    {
        tableName: 'Groups',
        timestamps: true,
    });

module.exports = Group;
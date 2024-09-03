const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30],
                notNull: {
                    msg: 'Provide user name',
                },
                notEmpty: {
                    msg: 'User name cannot be empty',
                },
            },
        }
},
    {
    tableName: 'Users',
    timestamps: true,
});

module.exports = User;
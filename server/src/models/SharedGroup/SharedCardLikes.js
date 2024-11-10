const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sequelize');
const { v4: uuidv4 } = require('uuid');
const {User, SharedGroup} = require("../models");

const SharedCardLikes = sequelize.define(
    'Group',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
        },
        sharedGroupId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: SharedGroup,
                key: 'id',
            },
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        }
    },
    {
        tableName: 'Groups',
        timestamps: true,
    });

module.exports = SharedCardLikes;
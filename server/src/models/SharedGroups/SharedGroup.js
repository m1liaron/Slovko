const { sequelize, DataTypes } = require("sequelize");
const {v4: uuidv4} = require("uuid");
const {User} = require("../models");

const SharedGroup = sequelize.define("SharedGroup", {
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
        references: {
            model: User,
            key: 'id',
        }
    },
});

module.exports = SharedGroup;
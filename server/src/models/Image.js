const {sequelize} = require("../db/sequelize");
const {DataTypes} = require("sequelize");
const {v4: uuidv4} = require("uuid");


const Image = sequelize.define(
    'Image',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }
);

module.exports = Image
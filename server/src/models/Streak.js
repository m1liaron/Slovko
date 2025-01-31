const {sequelize} = require("../db/sequelize");
const {DataTypes} = require("sequelize");
const {v4: uuidv4} = require("uuid");
const User = require("./User");


const Streak = sequelize.define("Streak", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    frozen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        }
    }
})

module.exports = Streak;
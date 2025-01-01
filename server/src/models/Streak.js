import {sequelize} from "../db/sequelize";
import {DataTypes} from "sequelize";
import {v4 as uuidv4} from "uuid";


const Streak = sequelize.define("Streak", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
})

module.exports = Streak;
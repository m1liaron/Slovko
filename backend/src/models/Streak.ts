import { sequelize } from "../db/sequelize";
import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { User } from "./User";

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
		defaultValue: false,
	},
	userId: {
		type: DataTypes.UUID,
		allowNull: false,
		references: {
			model: User,
			key: "id",
		},
	},
});

export { Streak }

import { sequelize } from "../db/sequelize";
import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

const Image = sequelize.define("Image", {
	id: {
		type: DataTypes.UUID,
		defaultValue: uuidv4,
		primaryKey: true,
	},
	url: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
});

export { Image };

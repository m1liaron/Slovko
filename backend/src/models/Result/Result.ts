import { DataTypes } from "sequelize";
import { sequelize } from "../../db/sequelize";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models";

const Result = sequelize.define(
	"Result",
	{
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
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
		startedLearn: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		completionTime: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		tableName: "Results",
		timestamps: true,
	},
);

export { Result };

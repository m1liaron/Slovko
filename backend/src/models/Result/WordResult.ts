import { DataTypes } from "sequelize";
import { sequelize } from "../../db/sequelize";
import { v4 as uuidv4 } from "uuid";
import { ResultMode } from "../models";

const WordResult = sequelize.define(
	"WordResult",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
		},
		resultModeId: {
			type: DataTypes.UUID,
			references: {
				model: ResultMode,
				key: "id",
			},
		},
		word: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		translate: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mistakesAmount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		tableName: "WordsResult",
		timestamps: true,
	},
);

export { WordResult };

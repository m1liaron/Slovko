import { DataTypes } from "sequelize";
import { sequelize } from "../../db/sequelize";
import { v4 as uuidv4 } from "uuid";
import { Result } from "../models";

const ResultMode = sequelize.define(
	"ResultMode",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
		},
		mode: {
			type: DataTypes.ENUM("flashCards", "quiz", "guessWord", "check"),
			allowNull: false,
		},
		resultId: {
			type: DataTypes.UUID,
			references: {
				model: Result,
				key: "id",
			},
		},
	},
	{
		tableName: "ResultsMode",
		timestamps: true,
	},
);

export { ResultMode };

import { DataTypes } from "sequelize";
import { sequelize } from "../../db/sequelize";
import { v4 as uuidv4 } from "uuid";
import { Result } from "../models";
import { BaseAttributes, BaseCreationAttributes, CustomModal } from "../CustomModel";

interface ResultModeAttributes extends BaseAttributes {
	mode: "flashCards" | "quiz" | "guessWord" | "check";
	resultId: string;
}

interface ResultModeCreationAttributes extends BaseCreationAttributes<ResultModeAttributes> { }

class ResultMode extends CustomModal<ResultModeAttributes, ResultModeCreationAttributes> implements ResultModeAttributes {
	public mode!: "flashCards" | "quiz" | "guessWord" | "check";
	public resultId!: string;
}

ResultMode.init(
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
		sequelize,
		modelName: "ResultMode",
		tableName: "ResultsMode",
		timestamps: true,
	},
);

export { ResultMode };

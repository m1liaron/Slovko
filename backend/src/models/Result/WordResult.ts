import { DataTypes } from "sequelize";
import { sequelize } from "../../db/sequelize.js";
import { v4 as uuidv4 } from "uuid";
import { ResultMode } from "../models.js";
import { BaseAttributes, BaseCreationAttributes, CustomModal } from "../CustomModel.js";

interface WordResultAttributes extends BaseAttributes {
	resultModeId: string;
	word: string;
	translate: string;
	mistakesAmount: number;
}

interface WordResultCreationAttributes extends BaseCreationAttributes<WordResultAttributes> { }

class WordResult extends CustomModal<WordResultAttributes, WordResultCreationAttributes> implements WordResultAttributes {
	public resultModeId!: string;
	public word!: string;
	public translate!: string;
	public mistakesAmount!: number;
}

WordResult.init(
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
		sequelize,
		modelName: "WordResult",
		tableName: "WordsResult",
		timestamps: true,
	},
);

export { WordResult };

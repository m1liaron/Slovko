import { DataTypes } from "sequelize";
import { sequelize } from "../../db/sequelize";
import { v4 as uuidv4 } from "uuid";
import { SharedGroup } from "./SharedGroup";

const SharedCard = sequelize.define(
	"SharedCard",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
		},
		word: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 30],
				notNull: {
					msg: "Please provide a word",
				},
				notEmpty: {
					msg: "Card word cannot be empty",
				},
			},
		},
		translateWord: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 30],
				notNull: {
					msg: "Please provide a translate word",
				},
				notEmpty: {
					msg: "Card translate word cannot be empty",
				},
			},
		},
		sharedGroupId: {
			type: DataTypes.UUID,
			references: {
				model: SharedGroup,
				key: "id",
			},
		},
	},
	{
		modelName: "SharedCards",
	},
);

export { SharedCard };

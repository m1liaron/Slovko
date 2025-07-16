import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../../db/sequelize.js";
import { User } from "../models.js";

import { BaseAttributes, BaseCreationAttributes, CustomModal } from "../CustomModel.js";
import { ResultMode } from "./ResultMode.js";

interface ResultAttributes extends BaseAttributes {
	title: string;
	userId: string;
	startedLearn: Date;
	completionTime: Date;
}

interface ResultCreationAttributes extends BaseCreationAttributes<ResultAttributes> { }

class Result extends CustomModal<ResultAttributes, ResultCreationAttributes> implements ResultAttributes {
	public title!: string;
	public userId!: string;
	public startedLearn!: Date;
	public completionTime!: Date;

	public mode?: ResultMode
}

Result.init(
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
		sequelize,
		modelName: "Result",
		tableName: "Results",
		timestamps: true,
	},
);

export { Result };

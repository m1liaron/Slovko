import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { sequelize } from "../sequelize.js";

import { CustomModal, type BaseAttributes, BaseCreationAttributes } from "@/db/models/custom-model.js";
import { User } from "@/modules/index.js";

interface StreakAttributes extends BaseAttributes {
	date: Date;
	frozen: number;
	userId: string;
}

interface StreakCreationAttributes extends BaseCreationAttributes<StreakAttributes> { }

class Streak extends CustomModal<StreakAttributes, StreakCreationAttributes> implements StreakAttributes {
	public date!: Date;
	public frozen!: number;
	public userId!: string;
}

Streak.init(
	{
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
			}
		}
	},
	{
		sequelize
	}
)

export { Streak }

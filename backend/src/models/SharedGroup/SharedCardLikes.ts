import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { sequelize } from "../../db/sequelize.js";
import type { BaseAttributes, BaseCreationAttributes} from "../CustomModel.js";
import { CustomModal } from "../CustomModel.js";

interface SharedCardLikesAttributes extends BaseAttributes {
	sharedGroupId: string;
	userId: string;
}

interface SharedCardLikesCreationAttributes extends BaseCreationAttributes<SharedCardLikesAttributes> { }

class SharedCardLikes extends CustomModal<SharedCardLikesAttributes, SharedCardLikesCreationAttributes> implements SharedCardLikesAttributes {
	public sharedGroupId!: string;
	public userId!: string;
}

SharedCardLikes.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
		},
		sharedGroupId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "SharedGroups",
				key: "id",
			},
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
	},
	{
		sequelize,
		tableName: "SharedCardLikes",
		timestamps: true,
	},
);

export { SharedCardLikes };

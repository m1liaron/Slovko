import { DataTypes } from "sequelize";
import { sequelize } from "../../db/sequelize";
import { v4 as uuidv4 } from "uuid";

const SharedCardLikes = sequelize.define(
	"SharedCardLike",
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
		tableName: "SharedCardLikes",
		timestamps: true,
	},
);

export { SharedCardLikes };

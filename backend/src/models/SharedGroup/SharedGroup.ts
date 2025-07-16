import { DataTypes } from "sequelize";
import { sequelize } from "../../db/sequelize";
import { v4 as uuidv4 } from "uuid";
import { User } from "../User";
import { BaseAttributes, BaseCreationAttributes, CustomModal } from "../CustomModel";
import { SharedCard } from "./SharedCard";

interface SharedGroupAttributes extends BaseAttributes {
	title: string;
	userId: string;
	isAnonymous: boolean;
}

interface SharedGroupCreationAttributes extends BaseCreationAttributes<SharedGroupAttributes> { }

class SharedGroup extends CustomModal<SharedGroupAttributes, SharedGroupCreationAttributes> implements SharedGroupAttributes {
	public title!: string;
	public userId!: string;
	public isAnonymous!: boolean;

	sharedCards?: SharedCard[]
}

SharedGroup.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				name: "Unique Group",
				msg: "Shared group with this title already exists!",
			},
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
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
		isAnonymous: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		}
	},
	{
		sequelize,
		tableName: "SharedGroups",
		timestamps: true,
	},
);

SharedGroup.prototype.toJSON = function () {
	const values = { ...this.get() };
	// If the group is marked as anonymous, remove the user data if it exists
	if (values.isAnonymous) {
		delete values.user;
	}
	return values;
};

export { SharedGroup };

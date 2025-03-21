const { DataTypes } = require("sequelize");
const { sequelize } = require("../../db/sequelize");
const { v4: uuidv4 } = require("uuid");
const User = require("../User");

const SharedGroup = sequelize.define(
	"SharedGroup",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
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

module.exports = SharedGroup;

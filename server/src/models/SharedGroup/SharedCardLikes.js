const { DataTypes } = require("sequelize");
const { sequelize } = require("../../db/sequelize");
const { v4: uuidv4 } = require("uuid");
const { User, SharedGroup } = require("../models");

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

module.exports = SharedCardLikes;

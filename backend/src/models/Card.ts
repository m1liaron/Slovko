import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize";
import { Group } from "./Group";
import { Image } from "./Image";

const Card = sequelize.define(
	"Card",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
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
		groupId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: Group,
				key: "id",
			},
		},
		imageId: {
			type: DataTypes.UUID,
			references: {
				model: Image,
				key: "id",
			},
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM("To Learn", "Repeated", "Know", "Learned"),
			allowNull: false,
			defaultValue: "To Learn",
		},
		definition: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: ""
		},
		example: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: ""
		},
		learnedAt: {
			type: DataTypes.DATE, // Date when the card was learned
			allowNull: true,
		},
		nextReviewAt: {
			type: DataTypes.DATE, // Date for the next review based on the curve
			allowNull: true,
		},
		reviewCount: {
			type: DataTypes.INTEGER, // Number of times the card has been reviewed
			defaultValue: 0,
		},
	},
	{
		tableName: "Cards",
		timestamps: true,
	},
);

Card.belongsTo(Image, { foreignKey: "imageId", as: "image" });
Image.hasMany(Card, { foreignKey: "imageId" });

export { Card };

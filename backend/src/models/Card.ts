import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { sequelize } from "../db/sequelize.js";

import type { BaseAttributes, BaseCreationAttributes} from "./CustomModel.js";
import { CustomModal } from "./CustomModel.js";
import { Group } from "./Group.js";
import { Image } from "./Image.js";
interface CardAttributes extends BaseAttributes {
	word: string;
	translateWord: string;
	groupId: string;
	imageId: string;
	status: "To Learn" | "Repeated" | "Know" | "Learned";
	definition: string;
	example: string;
	learnedAt: Date;
	nextReviewAt: Date;
	reviewCount: number;
}

interface CardCreationAttributes extends BaseCreationAttributes<CardAttributes> { }

class Card extends CustomModal<CardAttributes, CardCreationAttributes> implements CardAttributes {
	public word!: string;
	public translateWord!: string;
	public groupId!: string;
	public imageId!: string;
	public status!: "To Learn" | "Repeated" | "Know" | "Learned";
	public definition!: string;
	public example!: string;
	public learnedAt!: Date;
	public nextReviewAt!: Date;
	public reviewCount!: number;
}

Card.init(
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
		sequelize,
		modelName: "Card",
		tableName: "Cards",
		timestamps: true,
	},
);

Card.belongsTo(Image, { foreignKey: "imageId", as: "image" });
Image.hasMany(Card, { foreignKey: "imageId" });

export { Card };

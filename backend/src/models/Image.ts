import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { sequelize } from "../db/sequelize.js";

import type { BaseAttributes, BaseCreationAttributes} from "./CustomModel.js";
import { CustomModal } from "./CustomModel.js";

interface ImageAttributes extends BaseAttributes {
	url: string;
}

interface ImageCreationAttributes extends BaseCreationAttributes<ImageAttributes> {}

class Image extends CustomModal<ImageAttributes, ImageCreationAttributes> implements ImageAttributes {
	public url!: string;
}

Image.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
		},
		url: {
			type: DataTypes.TEXT,
			allowNull: false,
		}
	},
	{
		sequelize,
		modelName: "Image",
		tableName: "Images",
		timestamps: false
	}
);

export { Image };

import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import { Group } from "./Group.js";
import {
  BaseAttributes,
  BaseCreationAttributes,
  CustomModal,
} from "./CustomModel.js";

interface LanguageAttributes extends BaseAttributes {
  title: string;
  code: string | null;
}

class Language extends CustomModal<
  LanguageAttributes,
  BaseCreationAttributes<LanguageAttributes>
> {
  public title!: string;

  groups?: Group[];
}

Language.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 30],
        notNull: {
          msg: "Please provide a title",
        },
        notEmpty: {
          msg: "Title cannot be empty",
        },
      },
      unique: true,
    },
    code: {
      // this this used for languages, for example english: en
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Language",
    tableName: "Languages",
    timestamps: true,
  },
);

export { Language };

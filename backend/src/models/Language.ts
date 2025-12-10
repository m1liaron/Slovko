import { DataTypes } from "sequelize";

import { sequelize } from "../db/sequelize.js";

import type {
  BaseAttributes,
  BaseCreationAttributes} from "./CustomModel.js";
import {
  CustomModal,
} from "./CustomModel.js";
import type { Group } from "./Group.js";

interface LanguageAttributes extends BaseAttributes {
  title: string;
  code: string | null;
  symbol: string;
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
    symbol: {
      type: DataTypes.STRING,
      defaultValue: true,
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

import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../db/sequelize.js";
import { User } from "./User.js";
import { Group } from "./Group.js";
import {
  BaseAttributes,
  BaseCreationAttributes,
  CustomModal,
} from "./CustomModel.js";
import { Language } from "./Language.js";

interface SectionAttributes extends BaseAttributes {
  title: string;
  code: string | null;
  languageId: string;
  userId: string;
}

class Section extends CustomModal<
  SectionAttributes,
  BaseCreationAttributes<SectionAttributes>
> {
  public title!: string;
  public userId!: string;

  groups?: Group[];
}

Section.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    languageId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Language,
        key: "id",
      },
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Section",
    tableName: "Sections",
    timestamps: true,
  },
);

export { Section };

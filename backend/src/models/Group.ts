import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { sequelize } from "../db/sequelize.js";

import type { Card } from "./Card.js";
import type { BaseAttributes, BaseCreationAttributes} from "./CustomModel.js";
import { CustomModal } from "./CustomModel.js";
import type { User } from "./User.js";
interface GroupAttributes extends BaseAttributes {
  title: string;
  sectionId: string;
}

interface GroupCreationAttributes extends BaseCreationAttributes<GroupAttributes> { }

class Group extends CustomModal<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
  public title!: string;
  public sectionId!: string;

  cards?: Card[]
  user?: User
}
  
Group.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    title: {
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
    sectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Sections",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Group",
    tableName: "Groups",
    timestamps: true,
  }
);

export { Group };

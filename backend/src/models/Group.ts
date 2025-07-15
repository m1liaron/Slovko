import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize";
import { v4 as uuidv4 } from "uuid";
import { User } from "./User";
import { BaseAttributes, BaseCreationAttributes, CustomModal } from "./CustomModel";

interface GroupAttributes extends BaseAttributes {
  title: string;
  userId: string;
}

interface GroupCreationAttributes extends BaseCreationAttributes<GroupAttributes> { }

class Group extends CustomModal<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
  public title!: string;
  public userId!: string;
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
    modelName: "Group",
    tableName: "Groups",
    timestamps: true,
  }
);

export { Group };

import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize";
import { v4 as uuidv4 } from "uuid";
import { User } from "./User";

const Group = sequelize.define(
  "Group",
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
    tableName: "Groups",
    timestamps: true,
  }
);

export { Group };

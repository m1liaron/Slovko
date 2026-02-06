import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { sequelize } from "../../db/sequelize.js";
import type { BaseAttributes, BaseCreationAttributes } from "../CustomModel.js";
import { CustomModal } from "../CustomModel.js";

import { SharedGroup } from "./SharedGroup.js";

interface SharedCardAttributes extends BaseAttributes {
  word: string;
  translateWord: string;
  sharedGroupId: string;
}

interface SharedCardCreationAttributes extends BaseCreationAttributes<SharedCardAttributes> {}

class SharedCard
  extends CustomModal<SharedCardAttributes, SharedCardCreationAttributes>
  implements SharedCardAttributes
{
  public word!: string;
  public translateWord!: string;
  public sharedGroupId!: string;
}

SharedCard.init(
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
        len: [1, 100],
        notNull: {
          msg: "Please provide a translate word",
        },
        notEmpty: {
          msg: "Card translate word cannot be empty",
        },
      },
    },
    sharedGroupId: {
      type: DataTypes.UUID,
      references: {
        model: SharedGroup,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "SharedCards",
  },
);

export { SharedCard };

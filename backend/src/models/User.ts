import dotenv from "dotenv";
import type { Optional } from "sequelize";
import { Model, DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { sequelize } from "../db/sequelize.js";
import { encrypt } from "@/libs/modules/encrypt/encrypt.js";
dotenv.config();

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  streak: number;
  lastReviewAt: Date;
  points: number;
  frozen: boolean;
}

interface UserCreationAttributes extends Optional<
  UserAttributes,
  "id" | "image" | "streak" | "lastReviewAt" | "points" | "frozen"
> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public image?: string;
  public streak!: number;
  public lastReviewAt!: Date;
  public points!: number;
  public frozen!: boolean;

  public toJSON(): object {
    const values = this.get() as Partial<UserAttributes>;
    delete values.password;
    return values;
  }

}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 30],
      },
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    streak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastReviewAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => Date.now(),
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    frozen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
    tableName: "Users",
  },
);

User.beforeCreate(async (userData: User) => {
  const user = userData.get();
  if (!user.password) {
    throw new Error("Password is required");
  }
  user.password = await encrypt.hash(user.password);
});

export { User };

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Model, DataTypes, type Optional } from "sequelize";
import { sequelize } from "@/db/sequelize.js";
import { v4 as uuidv4 } from "uuid";

import { EnvVariables } from "@/common/enums/envVariables.js";
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
> { }

class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
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

    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async comparePassword(candidatePassword: string): Promise<boolean> {
        const user = this.get();
        return await bcrypt.compare(candidatePassword, user.password);
    }

    createJWT(): string {
        const user = this.get();

        return jwt.sign(
            { userId: user.id, name: user.name },
            EnvVariables.JWT_SECRET!,
            { expiresIn: "30d" },
        );
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
    user.password = await User.hashPassword(user.password);
});

export { User };

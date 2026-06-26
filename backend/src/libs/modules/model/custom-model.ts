import type { Optional } from "sequelize";
import { Model } from "sequelize";

interface BaseAttributes {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

type BaseCreationAttributes<T extends BaseAttributes> = Optional<T, "id" | "createdAt" | "updatedAt">;

class CustomModal<T extends BaseAttributes, K extends BaseCreationAttributes<T>> extends Model {
    public id!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export { CustomModal, type BaseCreationAttributes, type BaseAttributes };
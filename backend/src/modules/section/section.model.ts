import { DataTypes } from "sequelize";

import { sequelize } from "../db/sequelize.js";

import type { BaseAttributes, BaseCreationAttributes } from "./CustomModel.js";
import { CustomModal } from "./CustomModel.js";
import type { Group } from "./Group.js";
import { Language } from "./Language.js";
import { User } from "./User.js";

interface SectionAttributes extends BaseAttributes {
    title?: string;
    languageId?: string;
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
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        languageId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: Language,
                key: "id",
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
        modelName: "Section",
        tableName: "Sections",
        timestamps: true,
    },
);

export { Section };

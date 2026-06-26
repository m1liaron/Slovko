import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { sequelize } from "@/db/sequelize.js";
import { CustomModal, type BaseAttributes, BaseCreationAttributes } from "@/db/models/custom-model.js";

interface SharedCardLikeAttributes extends BaseAttributes {
    sharedGroupId: string;
    userId: string;
}

interface SharedCardLikeCreationAttributes extends BaseCreationAttributes<SharedCardLikeAttributes> { }

class SharedCardLike extends CustomModal<SharedCardLikeAttributes, SharedCardLikeCreationAttributes> implements SharedCardLikeAttributes {
    public sharedGroupId!: string;
    public userId!: string;
}

SharedCardLike.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
        },
        sharedGroupId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "SharedGroups",
                key: "id",
            },
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "SharedCardLike",
        timestamps: true,
    },
);

export { SharedCardLike };

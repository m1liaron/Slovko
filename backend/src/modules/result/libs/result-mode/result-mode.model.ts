import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { sequelize } from "@/db/sequelize.js";
import { CustomModal, type BaseAttributes, BaseCreationAttributes } from "@/db/models/custom-model.js";
import { Result } from "../../result.model.js";

interface ResultModeAttributes extends BaseAttributes {
    mode: "flashCards" | "quiz" | "guessWord" | "checkTranslate";
    resultId: string;
}

interface ResultModeCreationAttributes extends BaseCreationAttributes<ResultModeAttributes> { }

class ResultMode
    extends CustomModal<ResultModeAttributes, ResultModeCreationAttributes>
    implements ResultModeAttributes {
    public mode!: "flashCards" | "quiz" | "guessWord" | "checkTranslate";
    public resultId!: string;
}

ResultMode.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
        },
        mode: {
            type: DataTypes.ENUM("flashCards", "quiz", "guessWord", "checkTranslate"),
            allowNull: false,
        },
        resultId: {
            type: DataTypes.UUID,
            references: {
                model: Result,
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "ResultMode",
        tableName: "ResultsMode",
        timestamps: true,
    },
);

export { ResultMode };

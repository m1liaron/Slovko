const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../db/sequelize');
const { DataTypes, Model } = require('sequelize');
require('dotenv').config();

class User extends Model {
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async comparePassword(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    }

    createJWT() {
        return jwt.sign(
            { userId: this.id, name: this.name },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_LIFETIME,
            },
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
                len: [6],
            },
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        streak: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        lastReviewAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Date.now(),
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: true,
        tableName: 'Users',
    },
);

User.beforeCreate(async (user) => {
    if (user.password) {
        user.password = await User.hashPassword(user.password);
    }
});

module.exports = User;
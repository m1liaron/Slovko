const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize');
const { v4: uuidv4 } = require('uuid');
const Group = require("./Group");
const Image = require("./Image");

const Card = sequelize.define(
    'Card',
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
                msg: 'Please provide a word',
            },
            notEmpty: {
                msg: 'Card word cannot be empty',
            },
        },
    },
    translateWord: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 30],
            notNull: {
                msg: 'Please provide a translate word',
            },
            notEmpty: {
                msg: 'Card translate word cannot be empty',
            },
        },
    },
    
    groupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Group,
            key: 'id',
        },
    },
    imageId: {
      type: DataTypes.UUID,
      references: {
          model: Image,
          key: 'id'
      },
      allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Learned', 'To Learn', 'Know'),
        allowNull: false,
        defaultValue: 'To Learn'
    },
    learnedAt: {
        type: DataTypes.DATE, // Date when the card was learned
        allowNull: true,
    },
    nextReviewAt: {
        type: DataTypes.DATE, // Date for the next review based on the curve
        allowNull: true,
    },
    reviewCount: {
        type: DataTypes.INTEGER, // Number of times the card has been reviewed
        defaultValue: 0,
    }
},
{
        tableName: 'Cards',
        timestamps: true,
});

Card.belongsTo(Image, { foreignKey: 'imageId', as: 'image' });
Image.hasMany(Card, { foreignKey: 'imageId' });

module.exports = Card;
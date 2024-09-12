const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DATABASE_NAME, // database name
    process.env.DATABASE_USER_NAME, // username
    process.env.DATABASE_PASSWORD, // password
    {
        host: process.env.DATABASE_HOST || 'db',
        dialect: 'postgres',
        logging: console.log,
    },
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the PostgreSQL database:', error);
    }
};

module.exports = { sequelize, connectDB };
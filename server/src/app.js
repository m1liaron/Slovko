const express = require('express');
const app = express();
const cors = require('cors');
const { connectDB, sequelize } = require('./db/sequelize');

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB();
        console.log('Database connected, attempting to sync models...');
        // await sequelize.sync({ force: true });

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error starting server: ', error);
    }
};
start();
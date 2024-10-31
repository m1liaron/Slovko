const express = require('express');
const app = express();
const cors = require('cors');
const { connectDB, sequelize } = require('./db/sequelize');
const { userRoute, cardRoute, groupRoute, resultRoute} = require('./routes/routes');
const authMiddleware = require('./middlewares/authenticationMiddleware');

app.use(express.json());
app.use(cors());

app.use('/users', userRoute);
app.use('/cards', authMiddleware, cardRoute);
app.use('/groups', authMiddleware, groupRoute);
app.use('/results', authMiddleware, resultRoute);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB();
        console.log('Database connected, attempting to sync models...');
        await sequelize.sync({ alter: true});

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error starting server: ', error);
    }
};
start();
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    try {
        const { email } = req.body;
        const findUser = await User.findOne({ where: { email } });
        if (findUser) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: true, message: 'User already exist' });
        }

        const user = await User.create({ ...req.body });
        const token = user.createJWT();
        const {
            password: uselessPassword,
            ...mainUserData
        } = user.dataValues;
        res.status(StatusCodes.CREATED).json({ user: mainUserData, token });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: error.message || 'Registration failed. Please try again later.',
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password: requestPassword } = req.body;
        if (!email || !requestPassword) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: true, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ error: true, message: 'Invalid credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(
            requestPassword,
            user.password,
        );
        if (!isPasswordCorrect) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ error: true, message: 'Invalid credentials' });
        }

        const token = user.createJWT();
        const {
            password: uselessPassword,
            ...mainUserData
        } = user;
        res
            .status(StatusCodes.OK)
            .json({ user: mainUserData, token });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: error.message || 'Login failed. Please try again later.',
        });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: true, message: 'User does not exist' });
        }

        const { password, ...mainUserData} = user.dataValues;
        res.status(200).json({ user: mainUserData });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: true, message: error.message || 'Internal Server Error' });
    }
};

const updateUser = async (req, res) => {
    const {
        params: { userId },
        body,
    } = req;
    try {
        if (body.image === "") {
            delete body.image; // Prevent overwriting the image with an empty string
        }

        const updatedUser = await User.update(body, {
            where: { id: userId },
            returning: true,
            plain: true,
        });

        if (!updatedUser) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: true, message: 'User does not found' });
        }

        const userObject = updatedUser[1].get();
        const { password, ...userWithoutPassword } = userObject;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: true, message: error.message || 'Internal Server Error' });
    }
};

const updateUserStreak = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user) {
            const lastReviewDate = user.lastReviewAt ? new Date(user.lastReviewAt) : null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Check if the user reviewed on a consecutive day
            if (lastReviewDate && lastReviewDate.getTime() === today.getTime() - 86400000) { // 86400000 ms in a day
                user.streak += 1
            } else if (!lastReviewDate || lastReviewDate.getTime() !== today.getTime()) {
                user.streak = 1;
            }

            user.lastReviewAt = today; // Update last review date
            await user.save();
        }

        res.status(200).json(user)
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: true, message: error.message || 'Internal Server Error' });
    }
}

module.exports = {
    register,
    getUser,
    login,
    updateUser
}
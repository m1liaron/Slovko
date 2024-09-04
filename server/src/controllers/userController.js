const User = require('../models/User');

const login = async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findOne({
            where: { name }
        });
        if(!user) {
            const newUser = await User.create({name});
            return res.status(200).json(newUser);
        }
        return res.status(200).json(user);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error login'})
    }
}

module.exports = {
    login
}
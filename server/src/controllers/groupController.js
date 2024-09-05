const Group = require('../models/Group');

const getAllGroups = async (req, res) => {
    const userId = req.user.id;
    try {
        const cards = await Group.findAll({
            where: { userId}
        });

        res.status(200).json(cards);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error login'})
    }
}

const getGroup = async (req, res) => {
    const { id } = req.body;
    const userId = req.user.id;
    try {
        const card = await Group.findOne({
            where: { id, userId }
        });
        if(!card) {
            res.status(200).send({ error: true, message: "Group does not exist" });
        }

        res.status(200).json(card);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error login'})
    }
}

const addGroup = async (req, res) => {
    const data = req.body;
    try {
        const newGroup = await Group.create({ ...data, userId: req.user.id });
        return res.status(200).json(newGroup);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error login'})
    }
}

const removeGroup = async (req, res) => {
    try {
        const {
            user: { id: userId},
            params: { id }
        } = req;
        const card = await Group.findOne({
            where: { id, userId }
        });
        if(!card) {
            res.status(404).send({ error: true, message: 'Card not found'})
        };
        res.status(200).json(card);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error login'})
    }
}

module.exports = {
    getAllGroups,
    getGroup,
    addGroup,
    removeGroup
}
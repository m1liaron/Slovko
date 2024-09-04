import Group from "../models/Group";

const getAllGroups = async (req, res) => {
    const userId = req.body;
    try {
        const cards = await Group.findAll({
            where: { userId}
        });

        res.status(200).json(cards);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error login'})
    }
}

const addGroup = async (req, res) => {
    const data = req.body;
    try {
        const newCard = await Group.create(data);
        return res.status(200).json(newCard);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error login'})
    }
}

const removeGroup = async (req, res) => {
    try {
        const userId = req.body;
        const cardId = req.params.id;
        const card = await Group.findOne({
            where: { id: cardId, userId }
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
    addGroup,
    removeGroup
}
import Card from "../models/Card";

const getAllCards = async (req, res) => {
    const { id, groupId} = req.body;
    try {
        const cards = await Card.findAll({
            where: { id, groupId }
        });

        res.status(200).json(cards);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error login'})
    }
}

const addCard = async (req, res) => {
    const data = req.body;
    try {
        const newCard = await Card.create(data);
        return res.status(200).json(newCard);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error login'})
    }
}

const removeCard = async (req, res) => {
    try {
        const groupId = req.body;
        const cardId = req.params.id;
        const card = await Card.findOne({
            where: { id: cardId, groupId }
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
    getAllCards,
    addCard,
    removeCard
}
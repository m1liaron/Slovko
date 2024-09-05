const Card =  require("../models/Card");

const getAllCards = async (req, res) => {
    const { groupId } = req.params;
    try {
        const cards = await Card.findAll({
            where: { groupId }
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
        const cardId = req.params.id;
        const card = await Card.findOne({
            where: { id: cardId }
        });
        if(!card) {
            res.status(404).send({ error: true, message: 'Card not found'})
        }
        await card.destroy();
        res.status(200).json(cardId);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error login'})
    }
}

module.exports = {
    getAllCards,
    addCard,
    removeCard
}
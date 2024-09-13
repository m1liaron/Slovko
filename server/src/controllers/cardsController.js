const Card =  require("../models/Card");
const calculateNextReviewDate = require('../helpers/calculateNextReviewDate');
const { Op } = require("sequelize");

const getAllCards = async (req, res) => {
    const { groupId } = req.params;
    try {
        const cards = await Card.findAll({
            where: { 
                groupId,
                [Op.or]: [
                    { status: 'To Learn' },
                    {
                        status: 'Learned',
                        nextReviewAt: {
                            [Op.lte]: today
                        }
                    }
                ]
             }
        });

        res.status(200).json(cards);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error get all cards'})
    }
}

const updateCardsAfterReview = async (req, res) => {
    const { groupId } = req.params;

    try {
        const groupCards = await Card.findAll({ where: { groupId } });

        for(let card of groupCards){
            const newReviewCount = card.reviewCount + 1;
            const nextReviewDate = calculateNextReviewDate(newReviewCount);

            card.status = 'Learned';
            card.learnedAt = new Date();
            card.reviewCount = newReviewCount;
            card.nextReviewAt = nextReviewDate;

            await card.save();
        }

        res.status(200).json(groupCards);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error update card'})
    }
}

const addCard = async (req, res) => {
    const data = req.body;
    try {
        const newCard = await Card.create({...data, status: 'To Learn' });
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
    removeCard,
    updateCardsAfterReview
}
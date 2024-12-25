const Card =  require("../models/Card");
const Image =  require("../models/Image");
const calculateNextReviewDate = require('../helpers/calculateNextReviewDate');
const {User, Group} = require("../models/models");
const {sequelize} = require("../db/sequelize");

const getRepeatedCards = async (req, res) => {
    try {
        const groups = await Group.findAll({
            where: {
                userId: req.user.id
            }
        });
        const repeatedCards = Promise.all(groups.map(async group => {
            return Card.findAll({
                where: {
                    groupId: group.id,
                    reviewDate: {
                        [sequelize.Op.lte]: new Date()
                    }
                },
                attributes: ['id']
            })
        }));

        const ids = repeatedCards.map(card => card.id);
        res.status(200).json({ ids })
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error get repeated cards'})
    }
}

const getAllCards = async (req, res) => {
    const { groupId } = req.params;
    const today = new Date();
    try {
        const cards = await Card.findAll({
            where: { 
                groupId
             },
            include: [{ model: Image, as: 'image' }]
        });

        const updatedCards = await Promise.all(
            cards.map(async card => {
                if(card.status === 'Learned' && card.newReviewCount <= today) {
                    card.status = 'To Learn';
                    await card.save();
                }
                return card;
            })
        )

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

        res.status(200).json(updatedCards);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error get all cards'})
    }
}

const getAllStatusCards = async (req, res) => {
    const { status, groupId } = req.params;
    try {
        const cards = await Card.findAll({
            where: { status, groupId }
        });
        
        res.status(200).json(cards);
    } catch(error) {
        res.status(400).send({ error: true, message: error.message || 'Getting cards'})
    }
}

const updateCardsAfterReview = async (req, res) => {
    const { groupId } = req.params;

    try {
        const groupCards = await Card.findAll({ where: { groupId } });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for(let card of groupCards){
            const cardNextReview = card.nextReviewAt ? new Date(card.nextReviewAt).setHours(0, 0, 0, 0) : null;

            if (cardNextReview && cardNextReview >= today.getTime()) {
                continue;
            }

            const newReviewCount = card.reviewCount + 1;
            const nextReviewDate = calculateNextReviewDate(newReviewCount);

            if (card.reviewCount >= 20) {
                card.status = 'Know';
            } else {
                card.status = 'Learned';
            }

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
    const { imageUri, ...data} = req.body;
    try {
        const image = await Image.create({ url: imageUri });
        const newCard = await Card.create({ imageId: image.id, ...data});

        const card = await Card.findOne({
            where: { id: newCard.id },
            include: [{ model: Image, as: 'image' }]
        })

        return res.status(200).json(card);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error login'})
    }
}

const updateCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        const { groupId } = req.body;
        const updatedCard = await Card.update(req.body, {
            where: { id: cardId, groupId },
            returning: true
        });

        if (updatedCard[0] === 0) {
            return res
                .status(404)
                .json({ error: true, message: 'Card not found' });
        }

        const card = await Card.findOne({
            where: { id: cardId },
        });

        res.status(200).json(card);
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
    updateCard,
    updateCardsAfterReview,
    getAllStatusCards,
    getRepeatedCards
}
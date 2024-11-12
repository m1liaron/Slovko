const {SharedGroup, SharedCard} = require("../models/models");

const createSharedGroup = async (req, res) => {
    const {
        body: {
            title,
            cards // [ { word, translate, image }, {}, {}, {} ]
        },
        user: { id }
    } = req;
    try {
        console.log(cards)
        const sharedGroup = await SharedGroup.create({ title, userId: id });
        await Promise.all(cards.map(async (card) => {
            await SharedCard.create({ ...card, sharedGroupId: sharedGroup.id });
        }))

        res.status(200).json(sharedGroup);
    } catch(error) {
        res.status(500).json({ error: true, message: error.message || 'Server Error. Try again later.'})
    }
}

const getAllSharedGroup = async (req, res) => {
    try {
        const allSharedGroups = await SharedGroup.findAll({ where: { userId: req.user.id } });

        res.status(200).json(allSharedGroups);
    } catch(error) {
        res.status(500).json({ error: true, message: error.message || 'Server Error. Try again later.'})
    }
}

const getSharedGroup = async (req, res) => {
    try {
        const sharedGroup = await SharedGroup.findOne({ where: { id: req.params.sharedGroupId }});
        res.status(200).json(sharedGroup);
    } catch(error) {
        res.status(500).json({ error: true, message: error.message || 'Server Error. Try again later.'})
    }
}

const copySharedGroup = async (req, res) => {
    const { sharedGroupId } = req.params;
    try {
        const sharedGroup = await SharedGroup.findOne({
            where: { id: sharedGroupId },
            include: { model: 'SharedGroup', as: 'sharedCards'}
        });
        if(!sharedGroup) {
            return res.status(404).json({ error: true, message: 'Shared group is not found' });
        }
        const newSharedGroup = await SharedGroup.create({ title: sharedGroup.title , userId: req.user.id });
        await Promise.all(sharedGroup.sharedCards.map(async (card) => {
            SharedCard.create(card);
        }));

        res.status(200).json(newSharedGroup);
    } catch(error) {
        res.status(500).json({ error: true, message: error.message || 'Server Error. Try again later.'})
    }
}

module.exports = {
    createSharedGroup,
    getAllSharedGroup,
    getSharedGroup,
    copySharedGroup,
}
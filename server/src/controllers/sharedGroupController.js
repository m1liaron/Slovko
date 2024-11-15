const { SharedGroup, SharedCard, Group, Card} = require("../models/models");

const createSharedGroup = async (req, res) => {
    const {
        body: { groupId, title },
        user: { id }
    } = req;
    try {
        const group = await Group.findOne({
            where: { id: groupId },
            include: [
                {
                    model: Card,
                    as: 'cards'
                }
            ],
        })
        if(!group) {
            res.status(404).json({ error: true, message: "Group is not defined"});
        }
        const sharedGroup = await SharedGroup.create({ title: title ? title : group.title, userId: id });
        if(group.cards.length) {
            await Promise.all(group.cards.map(async (card) => {
                await SharedCard.create({
                    word: card.word,
                    translateWord: card.translateWord,
                    sharedGroupId: sharedGroup.id });
            }))
        }

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
        const sharedGroup = await SharedGroup.findOne({
            where: { id: req.params.sharedGroupId },
            include: [
                {
                    model: SharedCard,
                    as: 'sharedCards'
                }
            ]
        });
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
            include: { model: SharedCard, as: 'sharedCards'}
        });
        if(!sharedGroup) {
            return res.status(404).json({ error: true, message: 'Shared group is not found' });
        }
        if(sharedGroup.userId !== req.user.id) {
            res.status(400).json({ error: true, message: 'You are not owner of this group!' });
        }
        const newGroup = await Group.create({ title: sharedGroup.title , userId: req.user.id });
        if(sharedGroup.sharedCards.length) {
            await Promise.all(sharedGroup.sharedCards.map(async (card) => {
                Card.create({
                    word: card.word,
                    translateWord: card.translateWord,
                    groupId: newGroup.id
                });
            }));
        }

        res.status(200).json(newGroup);
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
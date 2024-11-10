const {SharedGroup, SharedCard} = require("../models/models");

const createSharedGroup = async (req, res) => {
    const {
        title,
        cards, // [ { word, translate, image }, {}, {}, {} ]
        user: { id }
    } = req;
    try {
        const sharedGroup = await SharedGroup.create({ title, userId: id });
        await Promise.all(cards.map(async (card) => {
            SharedCard.create(card);
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

    } catch(error) {
        res.status(500).json({ error: true, message: error.message || 'Server Error. Try again later.'})
    }
}
const copySharedGroup = async (req, res) => {
    try {

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
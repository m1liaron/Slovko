const { Result, ResultMode, WordResult } = require('../models/models');

const saveResults = (req, res) => {
    const {
        body: {
            title,
            flashCards
        },
        user: { id }
    } = req;
    try {

        
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error save results'});
    }
}
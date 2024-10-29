const { Result, ResultMode, WordResult } = require('../models/models');

const getResults = async (req, res) => {
    try {
        const result = await Result.findAll({
            where: { userId: req.user.id },
        });
        if(!result) {
            return res.status(404).send({ error: true, message: 'Result is not find' })
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error saving results' });
    }
}

const getResultDetails = async (req, res) => {
    const { resultId } = req.params;
    try {
        const result = await Result.findOne({
            where: { userId: req.user.id, id: resultId },
            include: {
                model: ResultMode,
                as: 'mode',
                include: [
                    {
                        model: WordResult,
                        as: 'words',
                    }
                ]
            }
        });
        if(!result) {
            return res.status(404).send({ error: true, message: 'Result is not find' })
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error saving results' });
    }
}

const saveResults = async (req, res) => {
    const {
        body: {
            title,
            ...data
        },
        user: { id }
    } = req;

    try {
        // Step 1: Create a new Result entry
        const newResult = await Result.create({ title, userId: id });

        // Step 2: Create ResultMode entries and map mode names to their ids
        const resultModes = await Promise.all(
            Object.keys(data).map(mode =>
                ResultMode.create({
                    mode: mode,
                    resultId: newResult.id
                })
            )
        );

        // Step 3: Create WordResult entries, associating each with the correct ResultMode
        await Promise.all(
            Object.entries(data).map(([mode, words]) => {
                // Find the associated ResultMode entry
                const resultMode = resultModes.find(rm => rm.mode === mode);
                return Promise.all(
                    words.map(word =>
                        WordResult.create({
                            word: word.word,
                            translate: word.translateWord,
                            isCorrect: word.isCorrect,
                            resultModeId: resultMode.id
                        })
                    )
                );
            })
        );

        // Step 4: Fetch and include related entries for the response
        const result = await Result.findOne({
            where: { userId: id, id: newResult.id },
            include: {
                model: ResultMode,
                as: 'mode',
                include: [
                    {
                        model: WordResult,
                        as: 'words',
                    }
                ]
            }
        });

        // Return the result as a response
        res.status(200).json(result);

    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error saving results' });
    }
};

module.exports = {
    saveResults,
    getResults,
    getResultDetails
};

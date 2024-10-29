const { Result, ResultMode, WordResult } = require('../models/models');

const saveResults = async (req, res) => {
    const {
        body: {
            title,
            data,
        },
        user: { id }
    } = req;
    try {
        const newResult = await Result.create({ title, userId: id });
        const resultMode = await Promise.all(Object.keys(data).map(item => {
            return ResultMode.create({
                mode: item,
                resultId: newResult.id
            });
        }));
        await Promise.all(Object.values(data).map(item => {
            return ResultMode.create({
                word: item.word,
                translate: item.translateWord,
                isCorrect: item.isCorrect,
                resultModeId: resultMode.id
            });
        }));

        const result = await Result.findOne({
            where: { userId: id, id: newResult.id},
            include: {
                model: ResultMode,
                include: [
                    {
                        model: WordResult,
                        attributes: [ 'word', 'translate', 'isCorrect' ]
                    }
                ]
            }
        })

        res.status(200).json(result);
    } catch (error) {
        res.status(400).send({ error: true, message: error.message || 'Error save results'});
    }
}
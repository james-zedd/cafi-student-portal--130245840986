const asyncHandler = require('express-async-handler');
const KotoShitsumon = require('../models/KotoShitsumon');

// @route  GET /api/kotoshitsumon
// @desc   get all koto shitsumon items
// @secure true
const getAllKotoShitsumonItems = asyncHandler(async (req, res) => {
    try {
        const kotoShitsumonItems = await KotoShitsumon.find();

        res.status(200).json({
            status: 200,
            message: 'Successfully retreived koto shitsumon items',
            data: kotoShitsumonItems,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  POST /api/kotoshitsumon
// @desc   create a koto shitsumon item
// @secure true
const createKotoShitsumonItem = asyncHandler(async (req, res) => {
    const { id, question, categories, correct_answer, explanation, answers } = req.body;

    try {
        const kotoShitsumonItem = new KotoShitsumon({
            id,
            question,
            categories,
            correct_answer,
            explanation,
            answers,
        });

        kotoShitsumonItem.save();

        res.status(201).json({
            status: 201,
            message: 'Successfully created koto shitsumon item',
            data: kotoShitsumonItem,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  PATCH /api/kotoshitsumon/:id
// @desc   update a koto shitsumon item
// @secure true
const updateKotoShitsumonItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { question, categories, correct_answer, explanation, answers } = req.body;

    try {
        const kotoShitsumonItem = await KotoShitsumon.findOne({ id });

        if (!kotoShitsumonItem) {
            res.status(404);
            throw new Error('Koto shitsumon item not found.');
        }

        kotoShitsumonItem.question = question || kotoShitsumonItem.question;
        kotoShitsumonItem.categories = categories || kotoShitsumonItem.categories;
        kotoShitsumonItem.correct_answer = correct_answer || kotoShitsumonItem.correct_answer;
        kotoShitsumonItem.explanation = explanation || kotoShitsumonItem.explanation;
        kotoShitsumonItem.answers = answers || kotoShitsumonItem.answers;

        await kotoShitsumonItem.save();

        res.status(200).json({
            status: 200,
            message: 'Successfully updated koto shitsumon item',
            data: kotoShitsumonItem,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

module.exports = {
    getAllKotoShitsumonItems,
    createKotoShitsumonItem,
    updateKotoShitsumonItem,
};
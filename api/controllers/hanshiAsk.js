const asyncHandler = require('express-async-handler');
const HanshiAsk = require('../models/HanshiAsk');
const mongoose = require('mongoose');

// @route  GET /api/hanshiAsk/allQuestions
// @desc   get all questions to Hanshi
// @secure true
const allQuestions = asyncHandler(async (req, res) => {
    let inquiryDetails = {};

    if (!req.user.roles.includes('hanshi')) {
        inquiryDetails.inquirer = req.user.id;
    }

    try {
        const questions = await HanshiAsk.find(inquiryDetails);

        res.status(200).json({
            status: 200,
            message: 'Fetched all questions.',
            data: questions,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  GET /api/hanshiAsk/allQuestions/:questionId
// @desc   get a single question to Hanshi by question id
// @secure true
const singleQuestion = asyncHandler(async (req, res) => {
    const questionId = req.params.questionId;

    console.log('question id', questionId);

    let question;

    try {
        question = await HanshiAsk.find({
            _id: questionId,
        }).populate('inquirer', '_id name');
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }

    if (!question.length) {
        res.status(400);
        throw new Error('Cannot find question.');
    }

    console.log('question', question);

    if (!req.user.roles.includes('hanshi')) {
        if (req.user.id !== question[0].inquirer._id.toString()) {
            res.status(403);
            throw new Error(
                'You do not have permission to view this question.'
            );
        }
    }

    res.status(200).json({
        status: 200,
        message: 'Fetched question.',
        data: question,
    });
});

// @route  GET /api/hanshiAsk/myQuestions/:questionId
// @desc   get a single question to Hanshi by user and question id
// @secure true
const getQuestion = asyncHandler(async (req, res) => {
    const questionId = req.params.questionId;
    const id = req.user.id;

    let question;

    try {
        question = await HanshiAsk.find({
            _id: questionId,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }

    if (!question.length) {
        res.status(400);
        throw new Error('Cannot find question.');
    }

    if (id != question[0].inquirer) {
        res.status(401);
        throw new Error('You are not the author of the requested question.');
    }

    res.status(200).json({
        status: 200,
        message: 'Fetched question for user.',
        data: question,
    });
});

// @route  POST /api/hanshiAsk
// @desc   ask Hanshi a question
// @secure true
const askQuestion = asyncHandler(async (req, res) => {
    const { body } = req.body;
    const id = req.user.id;

    try {
        const question = new HanshiAsk({
            inquirer: id,
            body: body,
        });

        await question.save();

        res.status(201).json({
            status: 201,
            message: 'New question has been created.',
            question: question,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

module.exports = {
    allQuestions,
    singleQuestion,
    // myQuestions,
    getQuestion,
    askQuestion,
};

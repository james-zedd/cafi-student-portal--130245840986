const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const hasRole = require('../middleware/hasRole');

const HanshiAsk = require('../models/HanshiAsk');

// @route  GET /api/hanshiAsk/allQuestions
// @desc   get all questions to Hanshi
// @secure true
router.get('/allQuestions', jwtAuth, hasRole(['hanshi']), (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET hanshiAsk/allQuestions route',
    });
});

// @route  GET /api/hanshiAsk/allQuestions/:questionId
// @desc   get a single question to Hanshi by question id
// @secure true
router.get('/allQuestions/:id', jwtAuth, hasRole(['hanshi']), (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET hanshiAsk/allQuestions/:questionId route',
    });
});

// @route  GET /api/hanshiAsk/myQuestions
// @desc   get all questions to Hanshi by user
// @secure true
router.get('/myQuestions', jwtAuth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET hanshiAsk/myQuestions route',
    });
});

// @route  GET /api/hanshiAsk/myQuestions/:questionId
// @desc   get a single question to Hanshi by user and question id
// @secure true
router.get('/myQuestions/:questionId', jwtAuth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET hanshiAsk/myQuestions/:questionId route',
        id: req.params.id,
    });
});

// @route  POST /api/hanshiAsk
// @desc   ask Hanshi a question
// @secure true
router.post('/', jwtAuth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed POST hanshiAsk route',
    });
});

module.exports = router;

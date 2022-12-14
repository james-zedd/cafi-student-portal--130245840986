const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const hasRole = require('../middleware/hasRole');
const isValidObjectId = require('../middleware/isValidObjectId');
const { check } = require('express-validator');
const checkValidatorErrors = require('../middleware/checkValidatorErrors');

const HanshiAsk = require('../models/HanshiAsk');

const {
    allQuestions,
    singleQuestion,
    // myQuestions,
    getQuestion,
    askQuestion,
} = require('../controllers/hanshiAsk');

// @route  GET /api/hanshiAsk/allQuestions
// @desc   get all questions to Hanshi
// @secure true
router.get('/allQuestions', jwtAuth, allQuestions);

// @route  GET /api/hanshiAsk/allQuestions/:questionId
// @desc   get a single question to Hanshi by question id
// @secure true
router.get(
    '/allQuestions/:questionId',
    jwtAuth,
    isValidObjectId('paramsQuestion'),
    singleQuestion
);

// @route  GET /api/hanshiAsk/myQuestions
// @desc   get all questions to Hanshi by user
// @secure true
// [REMOVED] router.get('/myQuestions', jwtAuth, myQuestions);

// @route  GET /api/hanshiAsk/myQuestions/:questionId
// @desc   get a single question to Hanshi by user and question id
// @secure true
router.get(
    '/myQuestions/:questionId',
    jwtAuth,
    isValidObjectId('paramsQuestion'),
    getQuestion
);

// @route  POST /api/hanshiAsk
// @desc   ask Hanshi a question
// @secure true
router.post(
    '/',
    jwtAuth,
    [check('body', 'Please add a question to this post.').not().isEmpty()],
    checkValidatorErrors,
    askQuestion
);

module.exports = router;

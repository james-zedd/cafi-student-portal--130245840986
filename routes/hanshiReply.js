const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const hasRole = require('../middleware/hasRole');
const isValidObjectId = require('../middleware/isValidObjectId');
const { check } = require('express-validator');
const checkValidatorErrors = require('../middleware/checkValidatorErrors');

const HanshiReply = require('../models/HanshiReply');

const {
    getAllReplies,
    getSingleReply,
    createReply,
    createArticle,
    updateReply,
    deleteReply,
} = require('../controllers/hanshiReply');

// @route  GET /api/hanshiReply
// @desc   get all replies from Hanshi
// @secure true
router.get('/', jwtAuth, getAllReplies);

// @route  GET /api/hanshiReply/:replyId
// @desc   get a single reply from Hanshi
// @secure true
router.get(
    '/:replyId',
    jwtAuth,
    isValidObjectId('paramsReply'),
    getSingleReply
);

// @route  POST /api/hanshiReply
// @desc   Hanshi answers a question
// @secure true
router.post(
    '/',
    jwtAuth,
    hasRole(['hanshi']),
    [
        check('title', 'Please add a title to this reply.').not().isEmpty(),
        check('body', 'Please add some text to the body of this reply.')
            .not()
            .isEmpty(),
    ],
    checkValidatorErrors,
    isValidObjectId('bodyInquirer'),
    isValidObjectId('bodyQuestion'),
    createReply
);

// @route  POST /api/hanshiReply/create
// @desc   Hanshi creates an article
// @secure true
router.post(
    '/create',
    jwtAuth,
    hasRole(['hanshi']),
    [
        check('title', 'Please add a title to this reply.').not().isEmpty(),
        check('body', 'Please add some text to the body of this reply.')
            .not()
            .isEmpty(),
    ],
    checkValidatorErrors,
    createArticle
);

// @route  PUT/api/hanshiReply
// @desc   update a single reply
// @secure true
router.put(
    '/',
    jwtAuth,
    hasRole(['hanshi']),
    [
        check('title', 'Please add a title to this reply.').not().isEmpty(),
        check('body', 'Please add some text to the body of this reply.')
            .not()
            .isEmpty(),
    ],
    checkValidatorErrors,
    isValidObjectId('bodyReply'),
    updateReply
);

// @route  DELETE /api/hanshiReply/:replyId
// @desc   delete a single reply
// @secure true
router.delete(
    '/:replyId',
    jwtAuth,
    hasRole(['hanshi']),
    isValidObjectId('paramsReply'),
    deleteReply
);

module.exports = router;

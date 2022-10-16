const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const hasRole = require('../middleware/hasRole');
const { check } = require('express-validator');
const checkValidatorErrors = require('../middleware/checkValidatorErrors');

const HanshiReply = require('../models/HanshiReply');

const {
    getAllReplies,
    getSingleReply,
    createReply,
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
router.get('/:replyId', jwtAuth, getSingleReply);

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
    createReply
);

// @route  PUT/api/hanshiReply/:replyId
// @desc   update a single reply
// @secure true
router.put(
    '/:replyId',
    jwtAuth,
    hasRole(['hanshi']),
    [
        check('title', 'Please add a title to this reply.').not().isEmpty(),
        check('body', 'Please add some text to the body of this reply.')
            .not()
            .isEmpty(),
    ],
    checkValidatorErrors,
    updateReply
);

// @route  DELETE /api/hanshiReply/:replyId
// @desc   delete a single reply
// @secure true
router.delete('/:replyId', jwtAuth, hasRole(['hanshi']), deleteReply);

module.exports = router;

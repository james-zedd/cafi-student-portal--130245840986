const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const hasRole = require('../middleware/hasRole');

const HanshiReply = require('../models/HanshiReply');

// @route  GET /api/hanshiReply
// @desc   get all replies from Hanshi
// @secure true
router.get('/', jwtAuth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET hanshiReply/ route',
    });
});

// @route  GET /api/hanshiReply/:replyId
// @desc   get a single reply from Hanshi
// @secure true
router.get('/:replyId', jwtAuth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET hanshiReply/:replyId route',
    });
});

// @route  POST /api/hanshiReply
// @desc   Hanshi answers a question
// @secure true
router.post('/', jwtAuth, hasRole(['hanshi']), (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed POST askHanshi route',
    });
});

// @route  PUT /api/hanshiReply/:replyId
// @desc   update a single reply
// @secure true
router.put('/:replyId', jwtAuth, hasRole(['hanshi']), (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed PUT hanshiReply/:replyId route',
        id: req.params.replyId,
    });
});

// @route  DELETE /api/hanshiReply/:replyId
// @desc   delete a single reply
// @secure true
router.delete('/:replyId', jwtAuth, hasRole(['hanshi']), (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed DELETE hanshiReply/:replyId route',
        id: req.params.replyId,
    });
});

module.exports = router;

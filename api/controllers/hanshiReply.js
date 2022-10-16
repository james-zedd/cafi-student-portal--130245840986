const asyncHandler = require('express-async-handler');
const HanshiAsk = require('../models/HanshiAsk');
const HanshiReply = require('../models/HanshiReply');

const mongoose = require('mongoose');

// @route  GET /api/hanshiReply
// @desc   get all replies from Hanshi
// @secure true
const getAllReplies = asyncHandler(async (req, res) => {
    let replies;

    try {
        replies = await HanshiReply.find();
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully got all Hanshi Replies',
        replies: replies,
    });
});

// @route  GET /api/hanshiReply/:replyId
// @desc   get a single reply from Hanshi
// @secure true
const getSingleReply = asyncHandler(async (req, res) => {
    const replyId = req.params.replyId;

    if (!mongoose.isValidObjectId(replyId)) {
        res.status(400);
        throw new Error('Reply Id is not valid.');
    }

    let reply;

    try {
        reply = await HanshiReply.findById(replyId);
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully found reply.',
        reply: reply,
    });
});

// @route  POST /api/hanshiReply
// @desc   Hanshi answers a question
// @secure true
const createReply = asyncHandler(async (req, res) => {
    const { inquirerId, questionId, title, body } = req.body;

    if (!mongoose.isValidObjectId(inquirerId)) {
        res.status(400);
        throw new Error('Inquirer Id is not valid.');
    }

    if (!mongoose.isValidObjectId(questionId)) {
        res.status(400);
        throw new Error('Question Id is not valid.');
    }

    const reply = new HanshiReply({
        inquirer: inquirerId,
        title: title,
        body: body,
    });

    try {
        await reply.save();
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }

    try {
        await HanshiAsk.findOneAndUpdate(
            { _id: questionId },
            {
                $set: {
                    status: 'isAnswered',
                    isAnswered: true,
                    replyId: reply._id,
                },
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }

    res.status(201).json({
        status: 201,
        message: 'New reply has been created.',
        reply: reply,
    });
});

// @route  PUT /api/hanshiReply/:replyId
// @desc   update a single reply
// @secure true
const updateReply = asyncHandler(async (req, res) => {
    const replyId = req.params.replyId;
    const { title, body } = req.body;

    if (!mongoose.isValidObjectId(replyId)) {
        res.status(400);
        throw new Error('Reply Id is not valid.');
    }

    try {
        await HanshiReply.findOneAndUpdate(
            { _id: replyId },
            {
                title: title,
                body: body,
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }

    res.status(200).json({
        status: 200,
        message: 'Reply has been updated.',
        data: {
            replyId: replyId,
            title: title,
            body: body,
        },
    });
});

// @route  DELETE /api/hanshiReply/:replyId
// @desc   delete a single reply
// @secure true
const deleteReply = asyncHandler(async (req, res) => {
    const replyId = req.params.replyId;

    if (!mongoose.isValidObjectId(replyId)) {
        res.status(400);
        throw new Error('Reply Id is not valid.');
    }

    try {
        await HanshiReply.findOneAndDelete({ _id: replyId });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }

    res.status(200).json({
        status: 200,
        message: 'Reply has been deleted.',
        data: {
            replyId: replyId,
        },
    });
});

module.exports = {
    getAllReplies,
    getSingleReply,
    createReply,
    updateReply,
    deleteReply,
};

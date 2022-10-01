const express = require('express');
const router = express.Router();
const jwtauth = require('../middleware/jwtauth');
const hasRole = require('../middleware/hasrole');

const HanshiAsk = require('../models/HanshiAsk');
const HanshiAnswer = require('../models/HanshiAnswer');

// @route  GET /api/askHanshi/admin
// @desc   get all questions asked
// @secure true
router.get('/admin', jwtauth, hasRole(['hanshi']), (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET askHanshi/admin route',
    });
});

// @route  GET /api/askHanshi/admin/:id
// @desc   get a single question asked
// @secure true
router.get('/admin/:id', jwtauth, hasRole(['hanshi']), (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET askHanshi/admin/:id route',
        id: req.params.id,
    });
});

// @route  POST /api/askHanshi/admin
// @desc   Hanshi answers a question
// @secure true
router.post('/admin', jwtauth, hasRole(['hanshi']), (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed POST askHanshi/admin route',
    });
});

// @route  PUT /api/askHanshi/admin/:id
// @desc   update a single reply to a question
// @secure true
router.put('/admin/:id', jwtauth, hasRole(['hanshi']), (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed PUT askHanshi/admin/:id route',
        id: req.params.id,
    });
});

// @route  POST /api/askHanshi
// @desc   ask Hanshi a question
// @secure true
router.post('/', jwtauth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed POST askHanshi route',
    });
});

// @route  GET /api/askHanshi/reply
// @desc   get all replies from Hanshi
// @secure true
router.get('/reply', jwtauth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET askHanshi/reply route',
    });
});

// @route  GET /api/askHanshi/reply/:id
// @desc   get a single reply from Hanshi
// @secure true
router.get('/reply/:id', jwtauth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET askHanshi/reply/:id route',
        id: req.params.id,
    });
});

module.exports = router;

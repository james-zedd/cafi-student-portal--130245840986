const express = require('express');
const router = express.Router();
const jwtauth = require('../middleware/jwtauth');

const News = require('../models/News');

// @route  GET /api/news
// @desc   get all news feed items
// @secure true
router.get('/', jwtauth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET news route',
    });
});

// @route  POST /api/news
// @desc   create a news item
// @secure true
router.post('/', jwtauth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed POST news route',
    });
});

// @route  PUT /api/news/:id
// @desc   update a news item
// @secure true
router.put('/:id', jwtauth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed PUT news route',
        id: req.params.id,
    });
});

// @route  DELETE /api/news/:id
// @desc   delete a news item
// @secure true
router.delete('/:id', jwtauth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed DELETE news route',
        id: req.params.id,
    });
});

module.exports = router;

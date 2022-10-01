const express = require('express');
const router = express.Router();
const jwtauth = require('../middleware/jwtauth');

// @route  GET /api/exams
// @desc   get all exams
// @secure true
router.get('/', jwtauth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET exams route',
    });
});

// @route  GET /api/exams/:id
// @desc   get a single exam
// @secure true
router.get('/:id', jwtauth, (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'accessed GET exams/:id route',
        id: req.params.id,
    });
});

module.exports = router;

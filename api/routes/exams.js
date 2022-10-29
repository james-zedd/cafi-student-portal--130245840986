const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const isValidObjectId = require('../middleware/isValidObjectId');

const { getAllExams, getExam, createExam } = require('../controllers/exams');

// @route  GET /api/exams
// @desc   get all exams
// @secure true
router.get('/', jwtAuth, getAllExams);

// @route  GET /api/exams/:id
// @desc   get a single exam
// @secure true
router.get('/:examId', jwtAuth, isValidObjectId('paramsExam'), getExam);

// @route  POST /api/exams
// @desc   create a single exam
// @secure true
router.post('/', jwtAuth, createExam);

module.exports = router;

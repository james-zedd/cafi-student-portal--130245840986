const asyncHandler = require('express-async-handler');
const Exam = require('../models/Exam');
const Technique = require('../models/Technique');

// @route  GET /api/exams
// @desc   get all exams
// @secure true
const getAllExams = asyncHandler(async (req, res) => {
    try {
        const exams = await Exam.find();

        res.status(200).json({
            status: 200,
            message: 'Successfully retreived exams',
            data: exams,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  GET /api/exams/:id
// @desc   get a single exam
// @secure true
const getExam = asyncHandler(async (req, res) => {
    const { examId } = req.params;

    try {
        const exam = await Exam.find({
            _id: examId,
        }).populate('techniques');

        res.status(200).json({
            status: 200,
            message: 'Successfully got exam',
            data: exam,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  POST /api/exams
// @desc   create a single exam
// @secure true
const createExam = asyncHandler(async (req, res) => {
    const { examId, rankEng, belt, isAdultExam, isDanExam, techniques } =
        req.body;

    const dbTechniques = await Technique.find();

    let techArray = [];

    techniques.forEach((tech) => {
        techArray.push(dbTechniques.filter((dbT) => dbT.techId === tech));
    });

    const techIds = techArray.reduce((acc, elem) => {
        acc.push(elem[0]._id);
        return acc;
    }, []);

    try {
        const exam = new Exam({
            examId: examId,
            name: {
                rankEng: rankEng,
                belt: belt,
            },
            isAdultExam: isAdultExam,
            isDanExam: isDanExam,
            techniques: techIds,
        });

        await exam.save();

        res.status(201).json({
            status: 201,
            message: 'New exam has been created',
            data: exam,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

module.exports = {
    getAllExams,
    getExam,
    createExam,
};

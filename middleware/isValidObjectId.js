const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

module.exports = (idKey) => {
    return asyncHandler((req, res, next) => {
        let id;
        let idText;

        switch (idKey) {
            case 'paramsReply': {
                id = req.params.replyId;
                idText = 'Reply';
                break;
            }
            case 'paramsQuestion': {
                id = req.params.questionId;
                idText = 'Question';
                break;
            }
            case 'bodyInquirer': {
                id = req.body.inquirerId;
                idText = 'Inquirer';
                break;
            }
            case 'bodyQuestion': {
                id = req.body.questionId;
                idText = 'Question';
                break;
            }
            case 'bodyReply': {
                id = req.body.replyId;
                idText = 'Reply';
                break;
            }
            case 'paramsExam': {
                id = req.params.examId;
                idText = 'Exam';
                break;
            }
            case 'paramsDanShiteWaza': {
                id = req.params.danShiteWazaId;
                idText = 'Dan Shite Waza';
                break;
            }
            case 'paramsNoteId': {
                id = req.params.noteId;
                idText = 'Note';
                break;
            }
            default: {
                res.status(500);
                throw new Error('Server error -- Invalid idKey in isValidObjectId middleware.');
            }
        }

        if (!mongoose.isValidObjectId(id)) {
            res.status(400);
            throw new Error(`${idText} Id is not valid.`);
        }

        return next();
    });
};

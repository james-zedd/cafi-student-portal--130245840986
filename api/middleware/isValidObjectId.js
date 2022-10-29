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
            case 'paramsExam': {
                id = req.params.examId;
                idText = 'Exam';
                break;
            }
        }

        if (!mongoose.isValidObjectId(id)) {
            res.status(400);
            throw new Error(`${idText} Id is not valid.`);
        }

        return next();
    });
};

const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const postBlock = require('../middleware/postBlock');
const isValidObjectId = require('../middleware/isValidObjectId');

const { getAllDanShiteWaza, getDanShiteWaza, createDanShiteWaza, createDanShiteWazaNote, updateDanShiteWazaNote } = require('../controllers/danShiteWaza');

// @route  GET /api/danShiteWaza
// @desc   get all dan shite waza
// @secure true
router.get('/', jwtAuth, getAllDanShiteWaza);

// @route  GET /api/danShiteWaza/:id
// @desc   get a single dan shite waza
// @secure true
router.get('/:danShiteWazaId', jwtAuth, isValidObjectId('paramsDanShiteWaza'), getDanShiteWaza);

// @route  POST /api/danShiteWaza
// @desc   create a single dan shite waza
// @secure true
router.post('/', jwtAuth, postBlock, createDanShiteWaza);

// @route  POST /api/danShiteWaza/:id/notes
// @desc   create a note for a single dan shite waza
// @secure true
router.post('/:danShiteWazaId/notes', jwtAuth, postBlock, isValidObjectId('paramsDanShiteWaza'), createDanShiteWazaNote);

// @route  PUT /api/danShiteWaza/:id/notes/:noteId
// @desc   update a note for a single dan shite waza
// @secure true
router.put('/:danShiteWazaId/notes/:noteId', jwtAuth, postBlock, isValidObjectId('paramsDanShiteWaza'), isValidObjectId('paramsNoteId'), updateDanShiteWazaNote);

module.exports = router;
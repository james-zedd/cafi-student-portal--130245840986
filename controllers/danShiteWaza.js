const asyncHandler = require("express-async-handler");
const DanShiteWaza = require("../models/DanShiteWaza");
const DanShiteWazaNote = require("../models/DanShiteWazaNote");

// @route  GET /api/danShiteWaza
// @desc   get all dan shite waza
// @secure true
const getAllDanShiteWaza = asyncHandler(async (req, res) => {
    try {
        const danShiteWaza = await DanShiteWaza.find();

        res.status(200).json({
            status: 200,
            message: "Successfully retreived dan shite waza",
            data: danShiteWaza,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  GET /api/danShiteWaza/:id
// @desc   get a single dan shite waza
// @secure true
const getDanShiteWaza = asyncHandler(async (req, res) => {
    const { danShiteWazaId } = req.params;

    try {
        const danShiteWaza = await DanShiteWaza.find({
            _id: danShiteWazaId,
        });

        res.status(200).json({
            status: 200,
            message: "Successfully got dan shite waza",
            data: danShiteWaza,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  POST /api/danShiteWaza
// @desc   create a single dan shite waza
// @secure true
const createDanShiteWaza = asyncHandler(async (req, res) => {
    const { id, attack_name, technique_name, variants, dan_levels, yondan_suwari_waza, notes } = req.body;

    try {
        const newDanShiteWaza = await DanShiteWaza.create({
            id,
            attack_name,
            technique_name,
            variants,
            dan_levels,
            yondan_suwari_waza,
            notes,
        });

        res.status(201).json({
            status: 201,
            message: "Successfully created dan shite waza",
            data: newDanShiteWaza,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  POST /api/danShiteWaza/:id/notes
// @desc   create a note for a single dan shite waza
// @secure true
const createDanShiteWazaNote = asyncHandler(async (req, res) => {
    const { danShiteWazaId } = req.params;
    const { auth } = req.headers;
    const { content } = req.body;

    try {
        const newDanShiteWazaNote = await DanShiteWazaNote.create({
            author_id: auth._id,
            dan_shite_waza_id: danShiteWazaId,
            content,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        res.status(201).json({
            status: 201,
            message: "Successfully created note for dan shite waza",
            data: newDanShiteWazaNote,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  PATCH /api/danShiteWaza/:id/notes/:noteId
// @desc   update a note for a single dan shite waza
// @secure true
const updateDanShiteWazaNote = asyncHandler(async (req, res) => {
    const { danShiteWazaId, noteId } = req.params;
    const { auth } = req.headers;
    const { content } = req.body;

    try {
        const danShiteWazaNote = await DanShiteWazaNote.findOne({
            _id: noteId,
        });

        if (!danShiteWazaNote) {
            res.status(404);
            throw new Error("Note not found");
        }

        if (danShiteWazaNote.author_id.toString() !== auth._id.toString()) {
            res.status(403);
            throw new Error("User not authorized to update this note");
        }

        danShiteWazaNote.content = content;
        danShiteWazaNote.updated_at = Date.now();

        await danShiteWazaNote.save();

        res.status(200).json({
            status: 200,
            message: "Successfully updated note for dan shite waza",
            data: danShiteWazaNote,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

module.exports = {
    getAllDanShiteWaza,
    getDanShiteWaza,
    createDanShiteWaza,
};
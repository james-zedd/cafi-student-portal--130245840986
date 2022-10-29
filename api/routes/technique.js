const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const asyncHandler = require('express-async-handler');

const Technique = require('../models/Technique');

// @route  POST /api/techniques
// @desc   create a single technique
// @secure true
router.post(
    '/',
    jwtAuth,
    asyncHandler(async (req, res) => {
        const {
            techId,
            english,
            romanji,
            isContainer,
            order,
            orderVisible,
            variants,
            oyoWaza,
            suwariTachiWaza,
        } = req.body;

        try {
            const technique = new Technique({
                techId: techId,
                name: {
                    english: english,
                    romanji: romanji,
                },
                isContainer: isContainer,
                order: order,
                orderVisible: orderVisible,
                variants: variants,
                oyoWaza: oyoWaza,
                suwariTachiWaza: suwariTachiWaza,
            });

            await technique.save();

            res.status(201).json({
                status: 201,
                message: 'New technique has been created',
                data: technique,
            });
        } catch (error) {
            console.error(error.message);
            res.status(500);
            throw new Error(`Server error -- ${error.message}`);
        }
    })
);

module.exports = router;

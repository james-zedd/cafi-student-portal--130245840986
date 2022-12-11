const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const postBlock = require('../middleware/postBlock');
const asyncHandler = require('express-async-handler');

const Variant = require('../models/Variant');

// @route  POST /api/variant
// @desc   create a single technique
// @secure true
router.post(
    '/',
    jwtAuth,
    postBlock,
    asyncHandler(async (req, res) => {
        const {
            techId,
            english,
            romanji,
            category,
            heading,
            order,
            orderVisible,
            oyoWaza,
            suwariTachiWaza,
        } = req.body;

        try {
            const variant = new Variant({
                techId: techId,
                name: {
                    english: english,
                    romanji: romanji,
                },
                category: category,
                heading: heading,
                order: order,
                orderVisible: orderVisible,
                oyoWaza: oyoWaza,
                suwariTachiWaza: suwariTachiWaza,
            });

            await variant.save();

            res.status(201).json({
                status: 201,
                message: 'New variant has been created',
                data: variant,
            });
        } catch (error) {
            console.error(error.message);
            res.status(500);
            throw new Error(`Server error -- ${error.message}`);
        }
    })
);

module.exports = router;

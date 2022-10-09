const { validationResult } = require('express-validator');
const User = require('../models/User');
const News = require('../models/News');

// @route  GET /api/news
// @desc   get all news feed items
// @secure true
const getAllNewsItems = async (req, res) => {
    try {
        const feed = await News.find().populate('publisher', 'name');

        res.status(200).json({
            status: 200,
            message: 'Successfully retreived news feed',
            data: feed,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
};

// @route  POST /api/news
// @desc   create a news item
// @secure true
const createNewsItem = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { body } = req.body;

    const user = await User.findOne({ _id: req.user.id });

    if (!user) {
        res.status(400).json({
            status: 400,
            message: 'User not found.',
        });
    }

    try {
        const news = new News({
            publisher: user._id,
            body: body,
        });

        news.save();

        res.status(201).json({
            status: 201,
            message: 'News post has been created.',
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
};

module.exports = {
    getAllNewsItems,
    createNewsItem,
};

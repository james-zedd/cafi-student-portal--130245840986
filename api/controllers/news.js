const asyncHandler = require('express-async-handler');
const News = require('../models/News');

// @route  GET /api/news
// @desc   get all news feed items
// @secure true
const getAllNewsItems = asyncHandler(async (req, res) => {
    try {
        const feed = await News.find().populate('publisher', 'name');

        const feedOrdered = feed.sort((a, b) => b.updatedAt - a.updatedAt);

        res.status(200).json({
            status: 200,
            message: 'Successfully retreived news feed',
            data: feedOrdered,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  POST /api/news
// @desc   create a news item
// @secure true
const createNewsItem = asyncHandler(async (req, res) => {
    const { body } = req.body;

    try {
        const news = new News({
            publisher: req.user.id,
            body: body,
        });

        news.save();

        res.status(201).json({
            status: 201,
            message: 'News post has been created.',
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  PATCH /api/news/:id
// @desc   update a news item
// @secure true
const updateNewsItem = asyncHandler(async (req, res) => {
    const { body } = req.body;

    try {
        await req.newsItem.updateOne({ body: body, lastUpdatedAt: Date.now() });

        res.status(200).json({
            status: 200,
            message: 'News post has been updated.',
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

// @route  DELETE /api/news/:id
// @desc   delete a news item
// @secure true
const deleteNewsItem = asyncHandler(async (req, res) => {
    try {
        await req.newsItem.deleteOne({ _id: id });

        res.status(200).json({
            status: 200,
            message: 'News post has been deleted.',
        });
    } catch (error) {
        console.error(error.message);
        res.status(500);
        throw new Error(`Server error -- ${error.message}`);
    }
});

module.exports = {
    getAllNewsItems,
    createNewsItem,
    updateNewsItem,
    deleteNewsItem,
};

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const News = require('../models/News');

module.exports = asyncHandler(async (req, res, next) => {
    let id;

    try {
        id = mongoose.Types.ObjectId(req.params.id);
    } catch (error) {
        res.status(400);
        throw new Error('News id is not valid.');
    }

    const newsItem = await News.findOne({ _id: id });

    if (!newsItem) {
        res.status(404);
        throw new Error('No news item found.');
    }

    const publisher = req.user.id;

    if (publisher !== newsItem.publisher.toString()) {
        res.status(401);
        throw new Error(
            'You are not the original publisher of this news item.'
        );
    }

    req.newsItem = newsItem;
    next();
});

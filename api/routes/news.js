const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const checkValidatorErrors = require('../middleware/checkValidatorErrors');
const newsItemValidator = require('../middleware/newsItemValidator');
const jwtAuth = require('../middleware/jwtAuth');

const {
    getAllNewsItems,
    createNewsItem,
    updateNewsItem,
    deleteNewsItem,
} = require('../controllers/news');

// @route  GET /api/news
// @desc   get all news feed items
// @secure true
router.get('/', jwtAuth, getAllNewsItems);

// @route  POST /api/news
// @desc   create a news item
// @secure true
router.post(
    '/',
    jwtAuth,
    [check('body', 'Please add some text to your post').not().isEmpty()],
    checkValidatorErrors,
    createNewsItem
);

// @route  PATCH /api/news/:id
// @desc   update a news item
// @secure true
router.patch(
    '/:id',
    jwtAuth,
    [check('body', 'Please add some text to your post').not().isEmpty()],
    checkValidatorErrors,
    newsItemValidator,
    updateNewsItem
);

// @route  DELETE /api/news/:id
// @desc   delete a news item
// @secure true
router.delete('/:id', jwtAuth, newsItemValidator, deleteNewsItem);

module.exports = router;

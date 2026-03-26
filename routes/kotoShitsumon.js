const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');

const { getAllKotoShitsumonItems, createKotoShitsumonItem, updateKotoShitsumonItem } = require('../controllers/kotoShitsumon');

// route  GET /api/kotoshitsumon
// desc   get all koto shitsumon
// secure true
router.get('/', jwtAuth, getAllKotoShitsumonItems);

// route  POST /api/kotoshitsumon
// desc   create a koto shitsumon
// secure true
router.post('/', jwtAuth, createKotoShitsumonItem);

// route  PATCH /api/kotoshitsumon/:id
// desc   update a koto shitsumon
// secure true
router.patch('/:id', jwtAuth, updateKotoShitsumonItem);

module.exports = router;
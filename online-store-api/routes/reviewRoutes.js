const express = require('express');
const router = express.Router();
const { authenticeUser } = require('../middleware/authentication');

const {
	createReview,
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
} = require('../controllers/reviewController');

router.route('/').post(authenticeUser, createReview).get(getAllReviews);

router
	.route('/:id')
	.get(getSingleReview)
	.patch(authenticeUser, updateReview)
	.delete(authenticeUser, deleteReview);

module.exports = router;

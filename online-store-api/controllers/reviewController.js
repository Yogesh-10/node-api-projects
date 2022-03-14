const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const Product = require('../models/ProductModel');
const Review = require('../models/ReviewModel');
const checkPermissions = require('../utils/checkPermissions');

const createReview = async (req, res) => {
	const { product: productId } = req.body;

	const isValidProduct = await Product.findOne({ _id: productId });

	if (!isValidProduct) {
		throw new NotFoundError(`No product with id : ${productId}`);
	}

	const alreadySubmitted = await Review.findOne({
		product: productId,
		user: req.user.userId,
	});

	if (alreadySubmitted) {
		throw new BadRequestError('Already submitted review for this product');
	}

	req.body.user = req.user.userId;
	const review = await Review.create(req.body);

	res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
	//populate will add extra fileds to the reviews for eg: instead of returning productid, we can populate product field
	//with name, company, price. path: refers to property in reviewModel
	const reviews = await Review.find({}).populate({
		path: 'product',
		select: 'name company price',
	});

	res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
	const { id: reviewId } = req.params;

	const review = await Review.findOne({ _id: reviewId });

	if (!review) {
		throw new NotFoundError(`No review with id ${reviewId}`);
	}

	res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
	const { id: reviewId } = req.params;
	const { rating, title, comment } = req.body;

	const review = await Review.findOne({ _id: reviewId });

	if (!review) {
		throw new NotFoundError(`No review with id ${reviewId}`);
	}

	checkPermissions(req.user, review.user);

	review.rating = rating;
	review.title = title;
	review.comment = comment;

	await review.save();
	res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
	const { id: reviewId } = req.params;

	const review = await Review.findOne({ _id: reviewId });

	if (!review) {
		throw new NotFoundError(`No review with id ${reviewId}`);
	}

	checkPermissions(req.user, review.user);
	await review.remove();

	res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' });
};

//Alternative approach for virtuals(ProductModel), unlike virtuals we can query here whatever we want from DB
const getSingleProductReviews = async (req, res) => {
	const { id: productId } = req.params;
	const reviews = await Review.find({ product: productId });
	res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
	createReview,
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
	getSingleProductReviews,
};

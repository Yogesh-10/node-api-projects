const express = require('express');
const router = express.Router();
const {
	authenticeUser,
	authorizePermissions,
} = require('../middleware/authentication');

const {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadImage,
} = require('../controllers/productController');
const { getSingleProductReviews } = require('../controllers/reviewController');

router
	.route('/')
	.post([authenticeUser, authorizePermissions('admin')], createProduct)
	.get(getAllProducts);

router
	.route('/uploadImage')
	.post([authenticeUser, authorizePermissions('admin')], uploadImage);

router
	.route('/:id')
	.get(getSingleProduct)
	.patch([authenticeUser, authorizePermissions('admin')], updateProduct)
	.delete([authenticeUser, authorizePermissions('admin')], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;

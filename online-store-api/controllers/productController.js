const path = require('path');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const Product = require('../models/ProductModel');

const createProduct = async (req, res) => {
	req.body.user = req.user.userId;

	const product = await Product.create(req.body);
	res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
	const products = await Product.find({});

	res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
	const { id: productId } = req.params;

	//populate reviews is virtual - not stored in DB - (check ProductModel)
	const product = await Product.findOne({ _id: productId }).populate('reviews');

	if (!product) {
		throw new NotFoundError(`No product with id : ${productId}`);
	}

	res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
	const { id: productId } = req.params;

	const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
		new: true,
		runValidators: true,
	});

	if (!product) {
		throw new NotFoundError(`No product with id : ${productId}`);
	}

	res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
	const { id: productId } = req.params;

	const product = await Product.findOne({ _id: productId });

	if (!product) {
		throw new NotFoundError(`No product with id : ${productId}`);
	}

	await product.remove(); //we use remove here instead of findOneAndDelete, because remove(), will trigger pre('remove') hook in ProductModel, (check ProductModel)
	// which will cascade the delete operation to reviews, because if we delete a product, we should also delete reviews associated to that product, there is no point in having reviews without products
	res.status(StatusCodes.OK).json({ msg: 'Success! Product removed.' });
};

const uploadImage = async (req, res) => {
	//we can use files propery on req obejct, since we use 'express-file-upload' middleware
	if (!req.files) {
		throw new BadRequestError('No File Uploaded');
	}

	const productImage = req.files.image; //the image property on files is what we name in frontend or in postman(while testing), it can be anything, eg: if we name as imageFile, then -> req.files.imageFile

	if (!productImage.mimetype.startsWith('image')) {
		throw new BadRequestError('Please Upload Image');
	}

	const maxSize = 1024 * 1024; //1MB

	if (productImage.size > maxSize) {
		throw new BadRequestError('Please upload image smaller than 1MB');
	}

	const imagePath = path.join(
		__dirname,
		'../public/uploads/' + `${productImage.name}`
	);

	await productImage.mv(imagePath); //moving file to public/uploads

	res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadImage,
};

const Product = require('../models/productModel');
const { getPostData } = require('../models/utils');

//@DESC Get All Products
//@Route GET /api/products
async function getProducts(req, res) {
	try {
		const products = await Product.findAll();
		res.writeHead(200, { 'Content-Type': 'application/json' });
		// res.write(JSON.stringify(product))
		// res.end()
		res.end(JSON.stringify(products)); //in one line for write and end
	} catch (error) {
		console.log(error);
	}
}

//@DESC Get single Product
//@Route GET /api/products/:id
async function getProduct(req, res, id) {
	try {
		const product = await Product.findByID(id);

		if (!product) {
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Route Not Found' }));
		} else {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(product));
		}
	} catch (error) {
		console.log(error);
	}
}

//@DESC Create a Product
//@Route POST /api/products
async function createProduct(req, res) {
	try {
		const body = await getPostData(req);

		const { title, description, price } = JSON.parse(body);

		const product = {
			title,
			description,
			price,
		};

		const newProduct = await Product.create(product);

		res.writeHead(201, { 'Content-Type': 'application/json' });
		return res.end(JSON.stringify(newProduct));
	} catch (error) {
		console.log(error);
	}
}

//@DESC Update a Product
//@Route PUT /api/products/:id
async function updateProduct(req, res, id) {
	try {
		const product = await Product.findByID(id);

		if (!product) {
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Product Not Found' }));
		} else {
			const body = await getPostData(req);

			const { title, description, price } = JSON.parse(body);

			const productData = {
				title: title || product.title,
				description: description || product.description,
				price: price || product.price,
			};

			const updatedProduct = await Product.update(id, productData);

			res.writeHead(200, { 'Content-Type': 'application/json' });
			return res.end(JSON.stringify(updatedProduct));
		}
	} catch (error) {
		console.log(error);
	}
}

// @desc    Delete Product
// @route   DELETE /api/product/:id
async function deleteProduct(req, res, id) {
	try {
		const product = await Product.findByID(id);

		if (!product) {
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Product Not Found' }));
		} else {
			await Product.remove(id);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: `Product ${id} removed` }));
		}
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
};

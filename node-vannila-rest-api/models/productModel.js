let products = require('../data/products.json');
const { v4: uuiddv4 } = require('uuid');
const { writeDataToFile } = require('./utils');

function findAll() {
	return new Promise((resolve, reject) => {
		resolve(products);
	});
}

function findByID(id) {
	return new Promise((resolve, reject) => {
		const product = products.find((p) => p.id === id);
		resolve(product);
	});
}

function create(product) {
	return new Promise((resolve, reject) => {
		const newProduct = { id: uuiddv4(), ...product };
		products.push(newProduct);
		writeDataToFile('./data/products.json', products);
		resolve(newProduct);
	});
}

function update(id, product) {
	return new Promise((resolve, reject) => {
		const index = products.findIndex((p) => p.id === id);
		products[index] = { id, ...product };
		writeDataToFile('./data/products.json', products);
		resolve(products[index]);
	});
}

function remove(id) {
	return new Promise((resolve, reject) => {
		products = products.filter((p) => p.id !== id);
		if (process.env.NODE_ENV !== 'test') {
			writeDataToFile('./data/products.json', products);
		}
		resolve();
	});
}

module.exports = { findAll, findByID, create, update, remove };

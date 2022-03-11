const { StatusCodes } = require('http-status-codes');
const User = require('../models/UserModel');
const { BadRequestError } = require('../errors');

const registerUser = async (req, res) => {
	const { email } = req.body;

	const userAlreadyExists = await User.findOne({ email });
	if (userAlreadyExists) {
		throw new BadRequestError('Email already exists');
	}

	const user = await User.create(req.body);
	res.status(StatusCodes.CREATED).json({ user });
};

const loginUser = async (req, res) => {
	res.send('login');
};

const logoutUser = async (req, res) => {
	res.send('logout');
};

module.exports = { registerUser, loginUser, logoutUser };

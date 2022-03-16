const { StatusCodes } = require('http-status-codes');
const User = require('../models/UserModel');
// const { createTokenUser, attachCookiesToResponse } = require('../utils/');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const registerUser = async (req, res) => {
	const { email, name, password } = req.body;

	const userAlreadyExists = await User.findOne({ email });
	if (userAlreadyExists) {
		throw new BadRequestError('Email already exists');
	}

	const verificationToken = 'random fake';
	const user = await User.create({ name, email, password, verificationToken });

	res.status(StatusCodes.CREATED).json({
		msg: 'Success! Please check your email to verify account',
		verificationToken: user.verificationToken,
	});
};

module.exports = { registerUser };

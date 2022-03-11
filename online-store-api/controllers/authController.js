const { StatusCodes } = require('http-status-codes');
const User = require('../models/UserModel');
const { generateToken, attachCookiesToResponse } = require('../utils/');
const { BadRequestError } = require('../errors');

const registerUser = async (req, res) => {
	const { email } = req.body;

	const userAlreadyExists = await User.findOne({ email });
	if (userAlreadyExists) {
		throw new BadRequestError('Email already exists');
	}

	const user = await User.create(req.body);

	const tokenUser = { user: user.name, userId: user._id, role: user.role };

	// const token = generateToken(tokenUser);
	// res.status(StatusCodes.CREATED).json({ user: tokenUser, token }); //seding token via json respone

	attachCookiesToResponse(res, tokenUser); //instead of directly sending tokne via response, we can send token using cookies(this is another approach)
	res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const loginUser = async (req, res) => {
	res.send('login');
};

const logoutUser = async (req, res) => {
	res.send('logout');
};

module.exports = { registerUser, loginUser, logoutUser };

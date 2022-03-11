const { StatusCodes } = require('http-status-codes');
const User = require('../models/UserModel');
const { generateToken, attachCookiesToResponse } = require('../utils/');
const { BadRequestError, UnauthenticatedError } = require('../errors');

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
	const { email, password } = req.body;

	if (!email || !password)
		throw new BadRequestError('Please provide email and password');

	const user = await User.findOne({ email });
	if (!user) throw new UnauthenticatedError('Invalid credentials');

	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) throw new UnauthenticatedError('Invalid credentials');

	const tokenUser = { user: user.name, userId: user._id, role: user.role };
	attachCookiesToResponse(res, tokenUser); //instead of directly sending tokne via response, we can send token using cookies(this is another approach)
	res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const logoutUser = async (req, res) => {
	res.cookie('token', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now() + 1000),
	});
	res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

module.exports = { registerUser, loginUser, logoutUser };

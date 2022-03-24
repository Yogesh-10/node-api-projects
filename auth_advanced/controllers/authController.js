const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/UserModel');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const {
	attachCookiesToResponse,
	createTokenUser,
	sendVerificationEmail,
} = require('../utils');
const Token = require('../models/TokenModel');

const registerUser = async (req, res) => {
	const { email, name, password } = req.body;

	const userAlreadyExists = await User.findOne({ email });
	if (userAlreadyExists) {
		throw new BadRequestError('Email already exists');
	}

	const verificationToken = crypto.randomBytes(40).toString('hex');
	const user = await User.create({ name, email, password, verificationToken });

	const origin = 'http://localhost:3000';
	await sendVerificationEmail({
		name: user.name,
		email: user.email,
		verificationToken: user.verificationToken,
		origin,
	});
	res.status(StatusCodes.CREATED).json({
		msg: 'Success! Please check your email to verify account',
	});
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new BadRequestError('Please provide email and password');
	}
	const user = await User.findOne({ email });

	if (!user) {
		throw new UnauthenticatedError('Invalid Credentials');
	}
	const isPasswordCorrect = await user.comparePassword(password);

	if (!isPasswordCorrect) {
		throw new UnauthenticatedError('Invalid Credentials');
	}
	if (!user.isVerified) {
		throw new UnauthenticatedError('Please verify your email');
	}
	const tokenUser = createTokenUser(user);

	// create refresh token
	let refreshToken = '';
	// check for existing token
	const existingToken = await Token.findOne({ user: user._id });

	if (existingToken) {
		const { isValid } = existingToken;

		if (!isValid) {
			throw new UnauthenticatedError('Invalid Credentials');
		}

		refreshToken = existingToken.refreshToken;
		attachCookiesToResponse({ res, user: tokenUser, refreshToken });
		res.status(StatusCodes.OK).json({ user: tokenUser });
		return;
	}

	refreshToken = crypto.randomBytes(40).toString('hex');
	const userAgent = req.headers['user-agent'];
	const ip = req.ip;
	const userToken = { refreshToken, ip, userAgent, user: user._id };

	await Token.create(userToken);

	attachCookiesToResponse(res, tokenUser);

	res.status(StatusCodes.OK).json({ user: tokenUser });
};

const verifyEmail = async (req, res) => {
	const { verificationToken, email } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		throw new UnauthenticatedError('Verification Failed');
	}

	if (user.verificationToken !== verificationToken) {
		throw new UnauthenticatedError('Verification Failed');
	}

	user.isVerified = true;
	user.verified = Date.now();
	user.verificationToken = '';

	await user.save();

	res.status(StatusCodes.OK).json({ msg: 'Email Verified' });
};

module.exports = { registerUser, loginUser, verifyEmail };

const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/UserModel');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const {
	attachCookiesToResponse,
	createTokenUser,
	sendVerificationEmail,
	sendResetPassswordEmail,
	createHash,
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

	await sendVerificationEmail({
		name: user.name,
		email: user.email,
		verificationToken: user.verificationToken,
		origin: process.env.ORIGIN,
	});

	res.status(StatusCodes.CREATED).json({
		msg: 'Success! Please check your email to verify account',
	});
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

	(user.isVerified = true), (user.verified = Date.now());
	user.verificationToken = '';

	await user.save();

	res.status(StatusCodes.OK).json({ msg: 'Email Verified' });
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
		attachCookiesToResponse(res, tokenUser, refreshToken);
		res.status(StatusCodes.OK).json({ user: tokenUser });
		return;
	}

	refreshToken = crypto.randomBytes(40).toString('hex');
	const userAgent = req.headers['user-agent'];
	const ip = req.ip;
	const userToken = { refreshToken, ip, userAgent, user: user._id };

	await Token.create(userToken);

	attachCookiesToResponse(res, tokenUser, refreshToken);

	res.status(StatusCodes.OK).json({ user: tokenUser });
};

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};

const logout = async (req, res) => {
	await Token.findOneAndDelete({ user: req.user.userId });

	res.cookie('accessToken', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now()), //this removes cookie from browser
	});

	res.cookie('refreshToken', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now()), //this removes cookie from browser
	});
	res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const forgotPassword = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		throw new BadRequestError('Please provide valid email');
	}

	const user = await User.findOne({ email });

	if (user) {
		const passwordToken = crypto.randomBytes(70).toString('hex');

		// send email
		await sendResetPassswordEmail({
			name: user.name,
			email: user.email,
			token: passwordToken,
			origin: process.env.ORIGIN,
		});

		const tenMinutes = 1000 * 60 * 10;
		const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

		user.passwordToken = createHash(passwordToken);
		user.passwordTokenExpirationDate = passwordTokenExpirationDate;

		await user.save();
	}

	res
		.status(StatusCodes.OK)
		.json({ msg: 'Please check your email for reset password link' });
};

const resetPassword = async (req, res) => {
	const { token, email, password } = req.body;

	if (!token || !email || !password) {
		throw new BadRequestError('Please provide all values');
	}

	const user = await User.findOne({ email });
	if (user) {
		const currentDate = new Date();

		//here we are using createHash(token) because we have already hashed passwordToken in Db. hashing is a one-way process and we cannot get the value back, we can compare only the hashes,
		//so we compare hashedpassword in Db and createHash(token)
		if (
			user.passwordToken === createHash(token) &&
			user.passwordTokenExpirationDate > currentDate
		) {
			user.password = password;
			user.passwordToken = null;
			user.passwordTokenExpirationDate = null;
			await user.save();
		}
	}

	res.send('reset password');
};

module.exports = {
	registerUser,
	loginUser,
	verifyEmail,
	logout,
	showCurrentUser,
	forgotPassword,
	resetPassword,
};

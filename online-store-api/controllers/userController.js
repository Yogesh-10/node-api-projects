const { StatusCodes } = require('http-status-codes');
const User = require('../models/UserModel');
const {
	BadRequestError,
	UnauthenticatedError,
	NotFoundError,
} = require('../errors');
const { createTokenUser, attachCookiesToResponse } = require('../utils');
const checkPermissions = require('../utils/checkPermissions');

const getAllUsers = async (req, res) => {
	const users = await User.find({ role: 'user' }).select('-password');
	res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
	const user = await User.findOne({ _id: req.params.id }).select('-password');

	if (!user) throw new NotFoundError(`No user with id ${req.params.id}`);

	//req.user is loggedin user coming from authentication middleware and user._id is the id user is trying to get
	checkPermissions(req.user, user._id); //we are checking this because, if a user get id of another user they can view the details of that user, we have to restrict that

	res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};

// update user with user.save()
const updateUser = async (req, res) => {
	const { email, name } = req.body;

	if (!email || !name) {
		throw new BadRequestError('Please provide all values');
	}
	const user = await User.findOne({ _id: req.user.userId });

	user.email = email;
	user.name = name;

	await user.save(); //user.save will trigger pre save hook in user model, which will re-hash our password again,
	//so we have to re-hash the password only if is modified (check - User model pre save hook)

	const tokenUser = createTokenUser(user);
	attachCookiesToResponse(res, tokenUser);

	res.status(StatusCodes.OK).json({ user: tokenUser });
};

// update user with findOneAndUpdate
// const updateUser = async (req, res) => {
// 	const { email, name } = req.body;

// 	if (!email || !name) {
// 		throw new BadRequestError('Please provide all values');
// 	}

// 	const user = await User.findOneAndUpdate(
// 		{ _id: req.user.userId },
// 		{ email, name },
// 		{ new: true, runValidators: true }
// 	);

// 	const tokenUser = createTokenUser(user);
// 	attachCookiesToResponse(res, tokenUser);

// 	res.status(StatusCodes.OK).json({ user: tokenUser });
// };

const updateUserPassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		throw new BadRequestError('Please provide both passwords');
	}

	const user = await User.findOne({ _id: req.user.userId });

	const isPasswordCorrect = await user.comparePassword(oldPassword);

	if (!isPasswordCorrect) {
		throw new UnauthenticatedError('Invalid Credentials');
	}

	user.password = newPassword; //set newPassword to user and then hash the password while saving
	await user.save(); //while saving we hash this passwords also, because in mongoose we have used pre save hook in User Model

	res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

module.exports = {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
};

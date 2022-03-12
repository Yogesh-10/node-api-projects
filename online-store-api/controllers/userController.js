const { StatusCodes } = require('http-status-codes');
const User = require('../models/UserModel');
const {
	BadRequestError,
	UnauthenticatedError,
	NotFoundError,
} = require('../errors');

const getAllUsers = async (req, res) => {
	const users = await User.find({ role: 'user' }).select('-password');
	res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
	const user = await User.findOne({ _id: req.params.id }).select('-password');

	if (!user) throw new NotFoundError(`No user with id ${req.params.id}`);
	res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
	res.send(req.body);
};

const updateUserPassword = async (req, res) => {
	res.send('get all users');
};

module.exports = {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
};

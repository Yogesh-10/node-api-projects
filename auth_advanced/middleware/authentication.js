const { UnauthenticatedError } = require('../errors');
const UnauthorizedError = require('../errors/unauthorized');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
	const token = req.signedCookies.token; //signedCookies is a property on req object and 'token' is the name we set up for cookie in res.cookie

	if (!token) {
		throw new UnauthenticatedError('Authentication Invalid');
	}

	try {
		const { user, userId, role } = isTokenValid(token);
		req.user = { user, userId, role }; //user, userId, role coming for jwt payload, because we signed the user data in generateToken method
		next();
	} catch (error) {
		throw new UnauthenticatedError('Authentication Invalid');
	}
};

//we are returning another function inside authorizePermissions function because, we are not passing a callback reference
//in userRoutes, instead we invoke it immediatly, eg: authorizePermissions('admin'), so we will get an error to pass callback function
//so to solve this problem we return a function inside authorizePermissions function, so the function inside will be used as
//callback (basically it will be called only when we need authorize, instead of invoking it immediatly)
const authorizePermissions = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new UnauthorizedError('Unauthorized to access this route');
		}
		next();
	};

	//The below approach also works, but what if we want to add a new role tomorrow, we just simply add user while invoking authorizePermissions() in
	//userRoutes

	// if (req.user.role !== 'admin') {
	// 	throw new UnauthorizedError('Unauthorized to access this route');
	// }
	// next();
};

module.exports = { authenticateUser, authorizePermissions };

const { UnauthorizedError } = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
	// console.log(requestUser);
	// console.log(resourceUserId);
	// console.log(typeof resourceUserId);
	if (requestUser.role === 'admin') return; //if admin we can proceed to next step in getSingleUser function
	if (requestUser.userId === resourceUserId.toString()) return; //if user trying to view their own resource, we are good and proceed to next step
	throw new UnauthorizedError('Not authorized to access this route'); //if none of them are true, then user is not admin or user trying to view other user's profile
};

module.exports = checkPermissions;

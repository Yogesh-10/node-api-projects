const createTokenUser = require('./createTokenUser');
const {
	generateToken,
	attachCookiesToResponse,
	isTokenValid,
} = require('./jwt');
const sendVerificationEmail = require('./sendVerificationEmail');

module.exports = {
	generateToken,
	attachCookiesToResponse,
	isTokenValid,
	createTokenUser,
	sendVerificationEmail,
};

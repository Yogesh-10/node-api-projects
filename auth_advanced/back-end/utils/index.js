const createHash = require('./createHash');
const createTokenUser = require('./createTokenUser');
const {
	generateToken,
	attachCookiesToResponse,
	isTokenValid,
} = require('./jwt');
const sendResetPassswordEmail = require('./sendResetPasswordEmail');
const sendVerificationEmail = require('./sendVerificationEmail');

module.exports = {
	generateToken,
	attachCookiesToResponse,
	isTokenValid,
	createTokenUser,
	sendVerificationEmail,
	sendResetPassswordEmail,
	createHash,
};

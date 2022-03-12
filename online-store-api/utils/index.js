const {
	generateToken,
	attachCookiesToResponse,
	isTokenValid,
} = require('./jwt');

module.exports = { generateToken, attachCookiesToResponse, isTokenValid };

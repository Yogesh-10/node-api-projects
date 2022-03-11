const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFE_TIME,
	});
};

const attachCookiesToResponse = (res, user) => {
	const token = generateToken(user);

	const oneDay = 1000 * 60 * 60 * 24;

	res.cookie('token', token, {
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		secure: process.env.NODE_ENV === 'production',
		signed: true, //we need to pass a secret inside cookie.parser()[in app.js] to sign cookie
	});
};

module.exports = { generateToken, attachCookiesToResponse };

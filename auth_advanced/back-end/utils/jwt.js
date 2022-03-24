const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET);
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = (res, user, refreshToken) => {
	const accessTokenJWT = generateToken({ user });
	const refreshTokenJWT = generateToken({ user, refreshToken });

	const oneDay = 1000 * 60 * 60 * 24;
	const longerExpiry = 1000 * 60 * 60 * 24 * 30;

	res.cookie('accessToken', accessTokenJWT, {
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		secure: process.env.NODE_ENV === 'production',
		signed: true, //we need to pass a secret inside cookie.parser()[in app.js] to sign cookie
	});

	res.cookie('refreshToken', refreshTokenJWT, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		signed: true,
		expires: new Date(Date.now() + longerExpiry),
	});
};

module.exports = { generateToken, attachCookiesToResponse, isTokenValid };

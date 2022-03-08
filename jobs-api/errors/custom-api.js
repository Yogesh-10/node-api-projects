class CustomAPIError extends Error {
	constructor(message) {
		super(message);
		console.log('custom api');
	}
}

module.exports = CustomAPIError;

const notFound = (req, res) => {
	console.log('not found');
	res.status(404).send('Route does not exist');
};

module.exports = notFound;

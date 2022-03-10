const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db/connect');

dotenv.config();

const app = express();

app.get('/', (req, res) => {
	res.send('hello');
});

const PORT = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDB();
		app.listen(PORT, console.log(`Server connected on PORT ${PORT}`));
	} catch (error) {
		console.log(error);
	}
};

start();

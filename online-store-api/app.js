const express = require('express');
const dotenv = require('dotenv');
require('express-async-errors');
const morgan = require('morgan');

const connectDB = require('./db/connect');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');

dotenv.config();

const app = express();

//middlewares
app.use(morgan('tiny'));
app.use(express.json()); //to get access to req.body in post and put requests

app.get('/', (req, res) => {
	res.send('hello');
});

//error handler middlewares
app.use(notFound);
app.use(errorHandlerMiddleware);

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

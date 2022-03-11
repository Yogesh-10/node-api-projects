const express = require('express');
const dotenv = require('dotenv');
require('express-async-errors');
const morgan = require('morgan');

const connectDB = require('./db/connect');
const authRouter = require('./routes/authRoutes');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json()); //to get access to req.body in post and put requests
app.use(cookieParser()); //get access to cookies in request (sent from browser)

app.get('/', (req, res) => {
	res.send('hello');
});

//testing incoming cookie
// app.get('/api/v1', (req, res) => {
// 	console.log(req.cookies);
// 	res.send('ecomm');
// });

app.use('/api/v1/auth', authRouter);

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

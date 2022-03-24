const express = require('express');
const dotenv = require('dotenv');
require('express-async-errors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./db/connect');
const authRouter = require('./routes/authRoutes');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

dotenv.config();

const app = express();

//security packages
app.set('trust proxy', 1); //enable reverse proxy, backend on 5000, frontend on 3000
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

//middlewares
app.use(morgan('dev'));
app.use(express.json()); //to get access to req.body in post and put requests
app.use(cookieParser(process.env.JWT_SECRET)); //get access to cookies in request (sent from browser)

app.use('/api/v1/auth', authRouter);

//error handler middlewares
app.use(notFoundMiddleware);
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

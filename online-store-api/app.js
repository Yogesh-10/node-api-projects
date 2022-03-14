const express = require('express');
const dotenv = require('dotenv');
require('express-async-errors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressFileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./db/connect');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

dotenv.config();

const app = express();

//security packages
app.set('trust proxy', 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 60,
	})
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

//middlewares
app.use(morgan('dev'));
app.use(express.json()); //to get access to req.body in post and put requests
app.use(cookieParser(process.env.JWT_SECRET)); //get access to cookies in request (sent from browser)

app.use(expressFileUpload());
app.use(express.static('./public'));

app.get('/', (req, res) => {
	res.send('hello');
});

//testing incoming cookie
// app.get('/api/v1', (req, res) => {
// 	console.log(req.cookies); //unsigned cookies -> signed: false
// 	console.log(req.signedCookies); //signed cookies -> signed: true
// 	res.send('ecomm');
// });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

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

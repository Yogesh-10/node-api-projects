const express = require('express');
const dotenv = require('dotenv');
require('express-async-errors');
const connectDB = require('./db/connect');

const productsRouter = require('./routes/products');
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

dotenv.config();

connectDB();

const app = express();

// routes
app.get('/', (req, res) => {
	res.send(
		'<h1>Products API</h1><a href="/api/v1/products">products route</a>'
	);
});

// products route
app.use('/api/v1/products', productsRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, console.log(`Server is listening port ${port}...`));

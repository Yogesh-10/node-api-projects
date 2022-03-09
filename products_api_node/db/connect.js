const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
		console.log(`connected to mongoDB ${conn.connection.host}`);
	} catch (error) {
		console.log(error);
	}
};

module.exports = connectDB;
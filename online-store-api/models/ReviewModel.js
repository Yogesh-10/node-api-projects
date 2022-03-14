const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
	{
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, 'Please provide rating'],
		},
		title: {
			type: String,
			trim: true,
			required: [true, 'Please provide review title'],
			maxlength: 100,
		},
		comment: {
			type: String,
			required: [true, 'Please provide review text'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		product: {
			type: mongoose.Schema.ObjectId,
			ref: 'Product',
			required: true,
		},
	},
	{ timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true }); //each user can have only one review on each product
//so we cannot set unique true on user and product seperately, so we have multi index(compound index) which makes one user to enter only one review

//This is static method on our schema, we also have instance methods, which we do using ReviewSchema.method.
//but static method is created using ReviewSchema.statics
ReviewSchema.statics.calcAvgRatingAndNumOfReviews = async function (productId) {
	//console.log(productId)

	//Aggregate lets you access the MongoDB aggregation pipeline that Mongoose will send to the MongoDB server. It is useful for adding stages to the beginning of the pipeline from middleware.

	//aggregate - Aggregation operations process multiple documents and return computed results, Group values from multiple documents together. Perform operations on the grouped data to return a single result.
	//$match: matches the product with productId
	//group: _id: here we are not grouping the products/reviews using id, so we pass null, for eg: if we want to group reviews based on rating, we can group them, _id: '$rating'
	//averageRating: $avg is from mongodb and '$rating' is property from reviewModel, avg will be calculated by mongoDb
	//numberOfReviews: $sum, we pass initial value as 1, and will be calulated later, when we keep on adding reviews
	const result = await this.aggregate([
		{ $match: { product: productId } },
		{
			$group: {
				_id: null,
				averageRating: { $avg: '$rating' },
				numOfReviews: { $sum: 1 },
			},
		},
	]);

	//after aggregation, we find that product and update the avgRating and numOfReviews for that product
	try {
		await this.model('Product').findOneAndUpdate(
			{ _id: productId },
			{
				averageRating: Math.ceil(result[0].averageRating) || 0,
				numOfReviews: result[0].numOfReviews || 0,
			}
		);
	} catch (error) {
		console.log(error);
	}
};

//this hook will be triggered after we save or update, for eg: after creating review
ReviewSchema.post('save', async function () {
	//'this' refers to current model and we call static method using this.constructor.
	//product is the productId from(reviewModel) which will be passed dynamically when we are accessing particular product, for eg: when creating, updating
	await this.constructor.calcAvgRatingAndNumOfReviews(this.product);
});

//this hook will be triggered after we delete, for eg: after deleting review
ReviewSchema.post('remove', async function () {
	//product is the productId from(reviewModel) which will be passed dynamically when we are accessing particular product, for eg: when deleting
	await this.constructor.calcAvgRatingAndNumOfReviews(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);

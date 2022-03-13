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

module.exports = mongoose.model('Review', ReviewSchema);

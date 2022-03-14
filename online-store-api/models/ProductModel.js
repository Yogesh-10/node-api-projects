const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'Please provide product name'],
			maxlength: [100, 'Name can not be more than 100 characters'],
		},
		price: {
			type: Number,
			required: [true, 'Please provide product price'],
			default: 0,
		},
		description: {
			type: String,
			required: [true, 'Please provide product description'],
			maxlength: [1000, 'Description can not be more than 1000 characters'],
		},
		image: {
			type: String,
			default: '/uploads/example.jpeg',
		},
		category: {
			type: String,
			required: [true, 'Please provide product category'],
			enum: ['office', 'kitchen', 'bedroom'],
		},
		company: {
			type: String,
			required: [true, 'Please provide company'],
			enum: {
				values: ['ikea', 'liddy', 'marcos'],
				message: '{VALUE} is not supported',
			},
		},
		colors: {
			type: [String],
			default: ['#222'],
			required: true,
		},
		featured: {
			type: Boolean,
			default: false,
		},
		freeShipping: {
			type: Boolean,
			default: false,
		},
		inventory: {
			type: Number,
			required: true,
			default: 15,
		},
		averageRating: {
			type: Number,
			default: 0,
		},
		numOfReviews: {
			type: Number,
			default: 0,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//virtuals are properties that do not persist on DB.

//we cannot use .populate on reviewController to populate reviews because there is no reference on productModel for reviews,
//so we setup virtuals so that we can populate reviews on products

// 'reviews' is what we used on populate('reviews') and ref is reference to ReviewModel
//localField is ProductModel id
//foriegnField is 'product' which is a property in ReviewModel
//we set justOne to false because we have to get a list of reviews, not only one review
ProductSchema.virtual('reviews', {
	ref: 'Review',
	localField: '_id',
	foreignField: 'product',
	justOne: false,
});
//we cannot query using virtuals because they are not in DB. so alternative approach is in reviewController (getSingleProductReviews)

//we use remove in productController instead of findOneAndDelete, because remove(), will trigger pre('remove') hook in ProductModel, (check ProductModel)
// which will cascade the delete operation to reviews, because if we delete a product, we should also delete reviews associated to that product, there is no point in having reviews without products
ProductSchema.pre('remove', async function () {
	//using "this" keyword we access this model(ProductModel), but we can also access, other model using model() method
	await this.model('Review').deleteMany({ product: this._id });
});

module.exports = mongoose.model('Product', ProductSchema);

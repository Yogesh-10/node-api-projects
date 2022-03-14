const express = require('express');
const router = express.Router();
const {
	authenticeUser,
	authorizePermissions,
} = require('../middleware/authentication');

const {
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
	createOrder,
	updateOrder,
} = require('../controllers/orderController');

router
	.route('/')
	.post(authenticeUser, createOrder)
	.get(authenticeUser, authorizePermissions('admin'), getAllOrders);

router.route('/showAllMyOrders').get(authenticeUser, getCurrentUserOrders);

router
	.route('/:id')
	.get(authenticeUser, getSingleOrder)
	.patch(authenticeUser, updateOrder);

module.exports = router;

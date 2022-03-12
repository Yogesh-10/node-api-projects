const express = require('express');
const router = express.Router();
const {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
} = require('../controllers/userController');
const {
	authenticeUser,
	authorizePermissions,
} = require('../middleware/authentication');

router.get('/', authenticeUser, authorizePermissions('admin'), getAllUsers);
router.get('/showMe', showCurrentUser);
router.patch('/updateUser', updateUser);
router.post('/updateUserPassword', updateUserPassword);

router.get('/:id', getSingleUser);

module.exports = router;

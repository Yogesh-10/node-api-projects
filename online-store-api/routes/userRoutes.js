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
router.get('/showMe', authenticeUser, showCurrentUser);
router.patch('/updateUser', authenticeUser, updateUser);
router.post('/updateUserPassword', authenticeUser, updateUserPassword);

router.get('/:id', authenticeUser, getSingleUser);

module.exports = router;

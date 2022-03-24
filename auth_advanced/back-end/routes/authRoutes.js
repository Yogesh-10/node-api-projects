const express = require('express');
const router = express.Router();
const {
	registerUser,
	loginUser,
	verifyEmail,
	logout,
	showCurrentUser,
	resetPassword,
	forgotPassword,
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authentication');

router.get('/showMe', authenticateUser, showCurrentUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.delete('/logout', authenticateUser, logout);

module.exports = router;

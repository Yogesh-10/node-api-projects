const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
	let testAccount = await nodemailer.createTestAccount();

	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		auth: {
			user: 'lo7alegeje6fmwvi@ethereal.email',
			pass: 'tD8CNBmqX6tK9xAcGX',
		},
	});

	return transporter.sendMail({
		from: '"Yogesh" <YogeshDev@gmail.com>', // sender address
		to,
		subject,
		html,
	});
};

module.exports = sendEmail;

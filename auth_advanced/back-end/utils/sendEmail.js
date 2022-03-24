const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		auth: {
			user: process.env.ETHEREAL_USER,
			pass: process.env.ETHEREAL_PASS,
		},
	});

	return transporter.sendMail({
		from: '"AuthWorkflow" <authworkflow@gmail.com>', // sender address
		to,
		subject,
		html,
	});
};

module.exports = sendEmail;

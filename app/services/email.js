const emailConfig = require('../../config').email.email_config;
const nodemailer = require('nodemailer');
// let testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport(emailConfig);

exports.sendEmail = () =>
  transporter
    .sendMail({
      from: emailConfig.user,
      to: 'jaclyn.marquardt@ethereal.email',
      subject: 'Thank you!',
      text: 'Thanks for subscribing'
    })
    .then(info => {
      console.log(info.accepted);
      return info;
    });

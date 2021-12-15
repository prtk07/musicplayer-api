require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationMail = (user, token) => {
  const msg = {
    to: { name: user.name, email: user.email },
    from: { name: process.env.SENDER_NAME, email: process.env.SENDER_EMAIL },
    subject: "Verfication Email",
    html: `<html>
        <head>
        </head>
        <body>
            <h1>Click Here to Verify</h1>
            <p><a href="${process.env.API_ENDPOINT}user/verify/${token}">VerifyEmail</a></p>
        </body>
      <html>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

const sendForgotPasswordMail = (user, token) => {
  const msg = {
    to: { name: user.name, email: user.email },
    from: { name: process.env.SENDER_NAME, email: process.env.SENDER_EMAIL },
    subject: "Reset Password Email",
    html: `<html>
        <head>
        </head>
        <body>
            <h1>Click Here to Change Password</h1>
            <p><a href="${process.env.LOCALHOST_ENDPOINT}user/resetPass/${token}">VerifyEmail</a></p>
        </body>
      <html>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Reset Password Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
  sendVerificationMail,
  sendForgotPasswordMail,
};

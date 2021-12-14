require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationMail = (user, token) => {
  const msg = {
    to: { name: user.name, email: user.email },
    from: { name: "Prateek Verma", email: "prateekverma70@gmail.com" },
    subject: "Verfication Email",
    html: `<html>
        <head>
        </head>
        <body>
            <h1>Click Here to Verify</h1>
            <p><a href="http://localhost:8080/user/verify/${token}">VerifyEmail</a></p>
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

module.exports = {
  sendVerificationMail,
};

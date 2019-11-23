const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'bloodcon@bwu.com',
    subject: 'Account creation mail',
    text: `Welcome to BloodCon, Mr. ${name}. Thanks for joining our initiative to create a better world.`
  })
}

const needBloodEmail = (email, bloodGroup, hospital, phone) => {
  sgMail.send({
    to: email,
    from: 'bloodcon@bwu.com',
    subject: 'Help needed',
    text: `Need ${bloodGroup} blood at ${hospital} Contact ${phone}`
  })
}


module.exports = {
  sendWelcomeEmail,
  needBloodEmail
}
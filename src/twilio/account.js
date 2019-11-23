const accountSid = 'ACd47011f787d81a9ccbb8dbd72e38cd56';
const authToken = process.env.TWILIO_API_KEY;
const client = require('twilio')(accountSid, authToken);

const sendWelcomeMessage = (number, name) => {
  client.messages
  .create({
    body: `Welcome to BloodCon, Mr. ${name}. Thanks for joining our initiative to create a better world.`,
    from: '+17013901858',
    to: number
  })
  .then(message => console.log(message.sid));
}

const needBlood = (number, bloodGroup, hospital, phone ) => {
  client.messages
  .create({
    body: `Need ${bloodGroup} blood at ${hospital} Contact ${phone}`,
    from: '+17013901858',
    to: number
  })
  .then(message => console.log(message.sid));
}

module.exports = {
  sendWelcomeMessage,
  needBlood
}
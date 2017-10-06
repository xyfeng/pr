var Twilio = require('twilio');

var accountSid = 'AC2cd1a37754580fab762048d570fc4018';
var authToken = 'c97d63fc16c40b563037b243a0e69a52';

var twilio = new Twilio(accountSid, authToken);

twilio.messages.create({
    body: 'Hello from Love PR',
    to: '+13476883364',
    from: '+14074568377'
  })
  .then((message) => console.log(message.sid));

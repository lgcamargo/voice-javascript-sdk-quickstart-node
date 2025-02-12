const VoiceResponse = require('twilio').twiml.VoiceResponse;
const AccessToken = require('twilio').jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const nameGenerator = require('../name_generator');
const config = require('../config');

let identity;

exports.tokenGenerator = function tokenGenerator() {
  identity = nameGenerator();

  const accessToken = new AccessToken(
      config.accountSid,
      config.apiKey,
      config.apiSecret
  );
  accessToken.identity = identity;
  const grant = new VoiceGrant({
    outgoingApplicationSid: config.twimlAppSid,
    incomingAllow: true,
  });
  accessToken.addGrant(grant);

  // Include identity and token in a JSON response
  return {
    identity: identity,
    token: accessToken.toJwt(),
  };
};

exports.voiceResponse = function voiceResponse(requestBody) {
  const toNumberOrClientName = requestBody.To;
  const callerId = config.callerId;
  const twiml = new VoiceResponse();
  // If the request to the /voice endpoint is TO your Twilio Number,
  // then it is an incoming call towards your Twilio.Device.
  if (toNumberOrClientName == callerId) {
    const dial = twiml.dial({
      record: 'record-from-answer-dual',
      recordingStatusCallback: 'https://761c-2804-1b3-a9c0-ab25-c575-f8a5-9c39-65a2.sa.ngrok.io/record'});
    // const dial = twiml.dial();
    // This will connect the caller with your Twilio.Device/client
    dial.client(identity);
  } else if (requestBody.To) {
    // This is an outgoing call
    // set the callerId
    const dial = twiml.dial({callerId,
      record: 'record-from-answer-dual',
      recordingStatusCallback: 'https://761c-2804-1b3-a9c0-ab25-c575-f8a5-9c39-65a2.sa.ngrok.io/record'});
    // testing commit
    dial.number(toNumberOrClientName);
  } else {
    twiml.say('Thanks for calling!');
  }

  return twiml.toString();
};

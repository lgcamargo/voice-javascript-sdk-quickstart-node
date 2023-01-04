const Router = require('express').Router;
const {tokenGenerator, voiceResponse} = require('./handler');
const config = require('../config');

const router = new Router();

router.get('/token', (req, res) => {
  res.send(tokenGenerator());
});

router.post('/voice', (req, res) => {
  res.set('Content-Type', 'text/xml');
  const result = voiceResponse(req.body);
  res.send(result);
});

router.post('/record', (req, res) => {
  const result = req.body;
  console.log(result);
});

router.get('/record', async (req, res) => {
  const client = require('twilio')(config.accountSid, config.apiToken);
  const penis = [];
  await client.calls.list({to: '+5512982270019', limit: 20})
      .then((calls) => calls.forEach((c) => penis.push(c)));
  res.send(penis);
  //http://localhost:3000/record << bater nessa rota
});

module.exports = router;

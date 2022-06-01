const express = require('express');
const bodyParser = require('body-parser');
const { sendMessageController } = require('./sendMessege');
const { submitLocationController } = require('./submitLocationController');

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());
apiRouter.post('/calls/:id/send-message', sendMessageController);
apiRouter.post("/calls/:id/location/submit", submitLocationController);

exports.apiRouter = apiRouter;
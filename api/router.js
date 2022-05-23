const express = require('express');
const bodyParser = require('body-parser');
const { sendMessageController } = require('./sendMessege');

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());
apiRouter.post('/calls/:id/send-message', sendMessageController);

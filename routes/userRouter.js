const userCtl = require('../controllers/userCtl')
const router = require('express').Router();

router.route('/')
  .get(userCtl.getUsers)
  .post(userCtl.insertUser)
module.exports = router;

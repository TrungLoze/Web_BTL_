const express = require('express');
const router = express.Router();
const ed2030Controller = require('../../controllers/ed2030/ed2030Controller');

router.get('/', ed2030Controller.xemVideo);

module.exports = router;

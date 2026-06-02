const express = require('express');
const router = express.Router();
const ac2070Controller = require('../controllers/ac2070Controller');

router.get('/', ac2070Controller.index);

module.exports = router;

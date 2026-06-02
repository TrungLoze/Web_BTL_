const express = require('express');
const router = express.Router();
const ac2030Controller = require('../controllers/ac2030Controller');

router.get('/', ac2030Controller.index);
router.post('/chat', ac2030Controller.chat);

module.exports = router;

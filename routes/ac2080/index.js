const express = require('express');
const router = express.Router();
const ac2080Controller = require('../../controllers/ac2080/ac2080Controller');

router.get('/', ac2080Controller.index);

module.exports = router;

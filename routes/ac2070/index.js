const express = require('express');
const router = express.Router();
const ac2070Controller = require('../../controllers/ac2070/ac2070Controller');

const authRouter = require('./auth');
const courseRouter = require('./course');
const userRouter = require('./user');
const profileRouter = require('./profile');

const { isAdmin, isLoggedIn } = require('../../middlewares/ac2070/authMiddleware');

router.use('/ac2070/auth', authRouter);
router.use('/course', courseRouter);
router.use('/ac2070/users', isAdmin, userRouter);
router.use('/ac2070/profile', isLoggedIn, profileRouter);

router.get('/', ac2070Controller.index);

module.exports = router;

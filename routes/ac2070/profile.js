const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/ac2070/profileController');

router.get('/', profileController.getProfile);
router.get('/ac2070/course', profileController.getMyCourses);
router.post('/update', profileController.postUpdateProfile);
router.post('/change-password', profileController.postChangePassword);

module.exports = router;

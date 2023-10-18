const router = require('express').Router();
const authController = require('../controlers/authController')


router.post('/signup', authController.signupController);

router.post('/login',authController.loginController);

router.get('/refresh',authController.refreshController);

router.post('/logout',authController.logoutController);

module.exports = router;
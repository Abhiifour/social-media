const router = require('express').Router();
const userController = require('../controlers/userController');
const requireUser = require('../middleware/requireUser');


router.post('/follow',requireUser,userController.followOrUnfollowUserController);
router.get('/getFeedData',requireUser,userController.getPostOfFollowingController);
router.get('/posts',requireUser,userController.getMyPostsController);
router.post('/posts',requireUser,userController.getUserPostsController);
router.delete('/',requireUser,userController.deleteProfileController);
router.get('/getMyInfo',requireUser,userController.getMyInfo);
router.put('/',requireUser,userController.updateUserProfile);
router.post('/getUserProfile',requireUser,userController.getUserProfile)


module.exports = router;
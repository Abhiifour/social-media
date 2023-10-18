const router = require('express').Router();
const postController = require('../controlers/postController');
const requireUser = require('../middleware/requireUser');


router.put('/',requireUser, postController.updatePostController);
router.post('/',requireUser, postController.createPostController);
router.post('/like',requireUser, postController.likeAndUnlikePost);
router.delete('/',requireUser,postController.deletePostController);



module.exports = router;
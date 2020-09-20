const express = require('express')
const router = express.Router()

const PostController = require('../controllers/post')
const checkAuth = require('../middlewares/check-auth')
const multer = require('../middlewares/multer')

router.post(
  '/',
  checkAuth,
  multer.single('postMedia'),
  PostController.create_post
)
router.patch(
  '/:postId',
  checkAuth,
  multer.single('postMedia'),
  PostController.update_post
)
router.post(
  '/image/:postId',
  checkAuth,
  multer.single('postMedia'),
  PostController.upload_file
)
router.delete('/:postId', checkAuth, PostController.delete_post)
router.get('/:userId', checkAuth, PostController.get_all_posts)
router.post('/get/:postId/:userId', checkAuth, PostController.get_post_byid)
router.post('/:postId/like', checkAuth, PostController.like_post)
router.post('/:postId/comment', checkAuth, PostController.comment_post)
router.post('/:commentId/reply', checkAuth, PostController.reply_to_comment)
router.post('/:commentId/like_comment', checkAuth, PostController.like_comment)
router.post('/get/audio', checkAuth, PostController.getAudios)
router.get('/comments/:postId', checkAuth, PostController.getComments)
router.get('/postUser/:userId', checkAuth, PostController.getPostByUser)
router.post('/save/:postId/:userId', checkAuth, PostController.savePost)
router.post('/report/:postId/:userId', checkAuth, PostController.reportPost)
router.get('/savedpost/:userId', checkAuth, PostController.getSavedPost)
router.get('/reported/posts', checkAuth, PostController.reportedPosts)

module.exports = router

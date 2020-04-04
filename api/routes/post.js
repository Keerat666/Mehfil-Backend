const express = require("express")
const router = express.Router()

const PostController = require("../controllers/post")
const checkAuth = require("../middlewares/check-auth")
const multer = require("../middlewares/multer")

router.post("/", checkAuth, multer.single("postMedia"), PostController.create_post)
router.patch("/:postId", checkAuth, multer.single("postMedia"), PostController.update_post)
router.delete("/:postId", checkAuth, PostController.delete_post)
router.get("/", PostController.get_all_posts2)
router.post("/:postId/like", checkAuth, PostController.like_post)
router.post("/:postId/comment", checkAuth, PostController.comment_post)
router.post("/:commentId/reply", checkAuth, PostController.reply_to_comment)
router.post("/:commentId/like_comment", checkAuth, PostController.like_comment)

module.exports = router
const express = require("express")
const router = express.Router()
const multer = require("../middlewares/multer")

const UserController = require("../controllers/user")

router.post("/signup", UserController.user_signup)
router.post("/login", UserController.user_login)
router.post("/signup/google", UserController.user_signup_google)
router.post("/login/google", UserController.user_login_google)
router.post("/signup/facebook", UserController.user_signup_facebook)
router.post("/login/facebook", UserController.user_login_facebook)
router.post("/follow/:userId/:followerId", UserController.follow)
router.get("/followers/:userId", UserController.followers)
router.get("/following/:userId", UserController.following)
router.get("/search/:query", UserController.searchPosts)
router.post("/image/:userId", multer.single("postMedia"), UserController.upload_profile)


module.exports = router
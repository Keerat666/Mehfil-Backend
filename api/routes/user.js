const express = require("express")
const router = express.Router()

const UserController = require("../controllers/user")

router.post("/signup", UserController.user_signup)
router.post("/login", UserController.user_login)
router.post("/signup/google", UserController.user_signup_google)
router.post("/login/google", UserController.user_login_google)
router.post("/signup/facebook", UserController.user_signup_facebook)
router.post("/login/google", UserController.user_login_facebook)

module.exports = router

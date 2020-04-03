const express = require("express")
const router = express.Router()

const checkAuth = require("../middlewares/check-auth")
const ProfileController = require("../controllers/profile")

router.post("/view/:userId", ProfileController.profile_view)
router.post("/view_self", checkAuth, ProfileController.profile_view_self)
router.post("/update", checkAuth, ProfileController.profile_update)

module.exports = router

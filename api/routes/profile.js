const express = require('express')
const router = express.Router()

const checkAuth = require('../middlewares/check-auth')
const ProfileController = require('../controllers/profile')

router.get('/view/:userId', ProfileController.profile_view)
router.post('/view_self', checkAuth, ProfileController.profile_view_self)
router.patch('/update/:userId', checkAuth, ProfileController.profile_update)
router.patch(
  '/update/professsion/:userId',
  checkAuth,
  ProfileController.profile_update_profession
)

module.exports = router

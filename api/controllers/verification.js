const mongoose = require('mongoose')
const User = require('../models/user')
const { use } = require('passport')

exports.check_verification = (req, res, next) => {
  User.findById(req.params.userId)
    .exec()
    .then(user => {
      console.log(user)
      res.status(200).json({
        _id: user._id,
        is_verified: user.is_verified
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'there was an error in fetching user profile',
        error: err
      })
    })
}

exports.update_verification = (req, res, next) => {
  updates = {
    is_verified: req.body.is_verified
  }
  console.log(updates)

  User.findByIdAndUpdate(req.params.userId, { $set: updates }, { new: true })
    .exec()
    .then(user => {
      console.log(user)
      res.status(200).json({
        _id: user._id,
        is_verified: user.is_verified
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'there was an error in updating user details',
        error: err
      })
    })
}

exports.allUsers = (req, res, next) => {
  User.find({})
    .exec()
    .then(users => {
      let allusers = []
      for (u in users) {
        allusers.push({
          user_id: users[u]['_id'],
          is_verified: users[u]['is_verified'],
          name: users[u]['name'],
          profession: users[u]['profession']
        })
      }
      if (allusers.length > 0) {
        res.status(200).json({ data: allusers })
      } else {
        res.status(204).json({
          message: 'No user data found'
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      })
    })
}

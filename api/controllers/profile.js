const mongoose = require('mongoose')

const Post = require('../models/post')
const User = require('../models/user')

exports.profile_view = (req, res, next) => {
  User.findById(req.params.userId)
    .exec()
    .then(user => {
      console.log(user)
      Post.find({ 'createdBy.userId': req.params.userId })
        .sort({ createdAt: -1 })
        .exec()
        .then(posts => {
          console.log(posts)
          res.status(200).json({
            _id: user._id,
            self: false,
            name: user.name,
            postCount: posts.length,
            followers_count: user.followers.length,
            following_count: user.following.length,
            description: user.description,
            profile_pic: user.profile_pic,
            username: user.username,
            email: user.email,
            profession: user.profession,
            genre: user.genre
          })
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({
            message: 'there was an error in fetching user profile',
            error: err
          })
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

exports.profile_view_self = (req, res, next) => {
  User.findById(req.userData.userId)
    .exec()
    .then(user => {
      console.log(user)
      Post.find({ 'createdBy.userId': req.userData.userId })
        .sort({ createdAt: -1 })
        .exec()
        .then(posts => {
          console.log(posts)
          res.status(200).json({
            _id: user._id,
            self: true,
            name: user.name,
            dob: user.dob,
            postCount: posts.length,
            posts
          })
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({
            message: 'there was an error in fetching user profile',
            error: err
          })
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

exports.profile_update = (req, res, next) => {
  updates = {
    description: req.body.description
  }
  console.log(updates)

  User.findByIdAndUpdate(req.params.userId, { $set: updates }, { new: true })
    .exec()
    .then(user => {
      console.log(user)
      res.status(200).json({
        user
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

exports.profile_update_profession = (req, res, next) => {
  updates = {
    profession: req.body.profession
  }
  console.log(updates)

  User.findByIdAndUpdate(req.params.userId, { $set: updates }, { new: true })
    .exec()
    .then(user => {
      console.log(user)
      res.status(200).json({
        user
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

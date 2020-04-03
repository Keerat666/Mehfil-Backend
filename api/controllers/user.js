const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const User = require("../models/user")
const Post = require("../models/post")

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User exists"
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            })
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: {
                firstName: req.body.name.firstName,
                lastName: req.body.name.lastName
              },
              provider: "local",
              email: req.body.email,
              password: hash
            })
            user
              .save()
              .then(result => {
                console.log(result)
                res.status(201).json({
                  message: "User created"
                })
              })
              .catch(err => {
                console.log(err)
                res.status(500).json({
                  error: err
                })
              })
          }
        })
      }
    })
}

exports.user_signup_google = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        console.log("user found")
        return res.status(409).json({
          message: "User exists"
        })
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          name: {
            firstName: req.body.name.firstName,
            lastName: req.body.name.lastName
          },
          provider: "google",
          providerId: req.body.providerId,
          email: req.body.email
        })
        user
          .save()
          .then(result => {
            console.log(result)
            res.status(201).json({
              message: "User created"
            })
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({
              error: err
            })
          })
      }
    })
}

exports.user_signup_facebook = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        console.log("user found")
        return res.status(409).json({
          message: "User exists"
        })
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          name: {
            firstName: req.body.name.firstName,
            lastName: req.body.name.lastName
          },
          provider: "facebook",
          providerId: req.body.providerId,
          email: req.body.email
        })
        user
          .save()
          .then(result => {
            console.log(result)
            res.status(201).json({
              message: "User created"
            })
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({
              error: err
            })
          })
      }
    })
}

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "User does not exist. Please sign up to continue."
        })
      } else if (user[0].provider !== "local") {
        if (user[0].provider == "google") {
          return res.status(401).json({
            message: "Please use the google sign in option"
          })
        } else {
          return res.status(401).json({
            message: "Please use the facebook sign in option"
          })
        }
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Failed to authenticate. Please try again."
            })
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id,
                name: user[0].name
              },
              process.env.JWT_KEY
            )
            return res.status(200).json({
              message: "Auth successful",
              token
            })
          }
          res.status(401).json({
            message:
              "Failed to authenticate. Please enter the correct password."
          })
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.user_login_google = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "User does not exist. Please sign up to continue."
        })
      } else {
        if (user[0].providerId == req.body.providerId) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
              name: user[0].name
            },
            process.env.JWT_KEY
          )
          return res.status(200).json({
            message: "Auth successful",
            token
          })
        } else {
          res.status(401).json({
            message: "Auth failed"
          })
        }
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.user_login_facebook = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Failed to authorize"
        })
      } else {
        if (user[0].providerId == req.body.providerId) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
              name: user[0].name
            },
            process.env.JWT_KEY
          )
          return res.status(200).json({
            message: "Auth successful",
            token
          })
        } else {
          res.status(401).json({
            message: "Auth failed"
          })
        }
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

/*
{
      $lookup: {
        from: "posts",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$createdBy.userId", "$$userId"] }
            }
          }
        ],
        as: "posts"
      }
    },
    {
      $unwind: "$_id"
    }
*/

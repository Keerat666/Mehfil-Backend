const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const User = require("../models/user")
const Post = require("../models/post")
const Fuse = require("fuse.js")

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
              password: hash,
              description: req.body.description,
              username: req.body.username
            })
            user
              .save()
              .then(result => {
                console.log(result)
                res.status(201).json({
                  message: "User created",
                  user_id: result._id
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
          email: req.body.email,
          description: req.body.description,
          username: req.body.username
        })
        user
          .save()
          .then(result => {
            console.log(result)
            res.status(201).json({
              message: "User created",
              user_id: result._id
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
          email: req.body.email,
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
              token: token,
              user_id: user[0]._id
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

exports.follow = (req, res, next) => {
  const follower = {
    followedBy: req.params.followerId,
    followedAt: Date.now(),
  }

  const following = {
    following: req.params.userId,
    followedAt: Date.now(),
  }
  User.findByIdAndUpdate(
    req.params.followerId, { $push: { following: following } }, { new: true }
  )
  .exec()
  .then(
  User.findByIdAndUpdate(
    req.params.userId, { $push: { followers: follower } }, { new: true }
  )
    .exec()
    .then(user => {
      console.log(user)
      res.status(200).json({
        message: "followed"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Failed",
        error: err
      })
    })
  )
}

exports.following = (req, res, next) => {
  User.find(
    {_id: req.params.userId }
  )
    .lean()
    .exec()
    .then((result, err) => {
      if (result) {
        res.send(result[0]["following"])
      } else {
        console.log("error" + err)
        res.send(err)
      }
    })
}

exports.followers = (req, res, next) => {
  User.find(
    { _id: req.params.userId }
  )
    .lean()
    .exec()
    .then((result, err) => {
      if (result) {
        res.send(result[0]["followers"])
      } else {
        console.log("error" + err)
        res.send(err)
      }
    })
}


exports.searchPosts = (req, res, next) => {
  User.find()
    .lean()
    .exec()
    .then((result, err) => {
      if (err) {
        res.send(err)
      } else {
        var options = {
          keys: ['name.firstName', 'email', 'username', 'name.lastName', 'description'],
          threshold: 0.4
        };
        var fuse = new Fuse(result, options)

        let fuse_result = fuse.search(req.params.query)
        if (fuse_result === [])
          res.status(200).json({ "msg": "No such products found" });
        else
          res.status(200).json(fuse_result);

      }
    })
}

// products_search(query, res) {
//   console.log(query)




//   ProductModel.find((err, ProductModel1) => {

//       if (query.length <= 0)
//           res.status(203).json({ "msg": "Please enter a search term" });

//       if (err) {
//           console.log(err);
//           res.status(500).json({ "err": err });
//       } else {
//           if (ProductModel1 == null) {
//               res.status(404).json({ "msg": "Product list is empty" });
//           } else {
              // var options = {
              //     keys: ['name', 'search_tags']
              // };
              // var fuse = new Fuse(ProductModel1, options)

              // let result = fuse.search(query)
              // if (result === [])
              //     res.status(200).json({ "msg": "No such products found" });
              // else
              //     res.status(200).json(result);


//           }
//       }
//   });
// },


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

const mongoose = require("mongoose")
const fs = require("fs")
const VideoLib = require("node-video-lib")
const path = require("path")
var probe = require("probe-image-size")

const Post = require("../models/post")
const Comment = require("../models/comment")

exports.create_post = (req, res, next) => {
    console.log("user data", req.userData)
    console.log("file", req.file)

    let post
    const imageTypes = /jpeg|jpg|png/
    const videoTypes = /mp4|flv/

    if (req.file == null || req.file == undefined) {
        post = new Post({
            _id: new mongoose.Types.ObjectId(),
            body: req.body.body,
            type: "text",
            createdAt: Date.now(),
            createdBy: {
                userId: req.body.createdBy.userId,
                name: req.body.createdBy.name
            }
        })

        post
            .save()
            .then(post => {
                console.log(post)
                res.status(201).json({
                    message: "Created post",
                    post: {
                        _id: post._id,
                        body: post.body,
                        media: post.media,
                        aspectRatio: post.aspectRatio,
                        type: post.type,
                        createdAt: post.createdAt,
                        createdBy: post.createdBy
                    }
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "Failed to create post",
                    error: err
                })
            })
    } else {
        const imageExtType = imageTypes.test(
            path.extname(req.file.path).toLowerCase()
        )
        const videoExtTypes = videoTypes.test(
            path.extname(req.file.path).toLowerCase()
        )

        if (imageExtType) {
            console.log("Image type true")

            probe(fs.createReadStream(req.file.path))
                .then(result => {
                    post = new Post({
                        _id: new mongoose.Types.ObjectId(),
                        body: req.body.body,
                        media: req.file.path,
                        aspectRatio: result.width / result.height,
                        type: "image",
                        createdAt: Date.now(),
                        createdBy: {
                            userId: req.userData.userId,
                            name: req.userData.name
                        }
                    })
                    post
                        .save()
                        .then(post => {
                            console.log(post)
                            res.status(201).json({
                                message: "Created post",
                                post: {
                                    _id: post._id,
                                    body: post.body,
                                    media: post.media,
                                    aspectRatio: post.aspectRatio,
                                    type: post.type,
                                    createdAt: post.createdAt,
                                    createdBy: post.createdBy
                                }
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                message: "Failed to create post",
                                error: err
                            })
                        })
                })
                .catch(err => {
                    res.send(500).json({
                        message: "Could not read image file",
                        error: err
                    })
                })
        } else if (videoExtTypes) {
            console.log("Video type true")
            fs.open(req.file.path, "r", function(err, fd) {
                try {
                    let movie = VideoLib.MovieParser.parse(fd)
                    console.log("movie width:", movie.tracks[0].width)
                    console.log("movie width:", movie.tracks[0].height)
                    console.log(
                            "aspect ratio:",
                            movie.tracks[0].width / movie.tracks[0].height
                        )
                        // Work with movie
                        // console.log("movie width:", movie.tracks["VideoTrack"].width)
                        // console.log("movie height:", movie.tracks[0].height)
                    post = new Post({
                        _id: new mongoose.Types.ObjectId(),
                        body: req.body.body,
                        media: req.file.path,
                        aspectRatio: movie.tracks[0].width / movie.tracks[0].height,
                        type: "video",
                        createdAt: Date.now(),
                        createdBy: {
                            userId: req.userData.userId,
                            name: req.userData.name
                        }
                    })

                    post
                        .save()
                        .then(post => {
                            console.log(post)
                            res.status(201).json({
                                message: "Created post",
                                post: {
                                    _id: post._id,
                                    body: post.body,
                                    media: post.media,
                                    aspectRatio: post.aspectRatio,
                                    type: post.type,
                                    createdAt: post.createdAt,
                                    createdBy: post.createdBy
                                }
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                message: "Failed to create post",
                                error: err
                            })
                        })
                } catch (ex) {
                    console.error("Error:", ex)
                } finally {
                    fs.closeSync(fd)
                }
            })
        }
    }
}

exports.update_post = (req, res, next) => {
    console.log(req.body)
    let updates
    if (req.file == null) {
        updates = {
            body: req.body.body
        }
    } else {
        updates = {
            body: req.body.body,
            media: req.file.path
        }
    }

    Post.findByIdAndUpdate(req.params.postId, { $set: updates }, { new: true })
        .exec()
        .then(post => {
            console.log(post)
            res.status(200).json({
                message: "post updated",
                post: {
                    _id: post._id,
                    body: post.body,
                    media: post.media,
                    type: post.type,
                    createdAt: post.createdAt,
                    createdBy: post.createdBy
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "failed to update post",
                error: err
            })
        })
}

exports.delete_post = (req, res, next) => {
    Post.findByIdAndDelete(req.params.postId)
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: "post deleted"
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "failed to delete post",
                error: err
            })
        })
}

exports.get_all_posts = (req, res, next) => {
    const customLabels = {
        totalDocs: "postCount",
        docs: "posts",
        page: "currentPage",
        nextPage: "next",
        prevPage: "prev",
        pagingCounter: "slNo"
    }

    const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: 20,
        sort: { createdAt: -1 },
        customLabels
    }

    Post.paginate({}, options)
        .then(result => {
            console.log(result)
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({})
        })
}

exports.like_post = (req, res, next) => {
    const like = {
            likedBy: req.body.userId,
            likedAt: Date.now()
        }
        //TODO check if the user id has already liked the post if yes throw error

    Post.findByIdAndUpdate(
            req.params.postId, { $push: { likes: like } }, { new: true }
        )
        .exec()
        .then(post => {
            console.log(post)
            res.status(200).json({
                message: "post liked successfully"
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "failed to like post",
                error: err
            })
        })
}

exports.comment_post = (req, res, next) => {
    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        postId: req.params.postId,
        body: req.body.body,
        createdAt: Date.now(),
        createdBy: {
            userId: req.body.userId,
            name: req.body.name
        }
    })

    comment
        .save()
        .then(comment => {
            console.log(comment)
            Post.findByIdAndUpdate(
                    comment.postId, { $push: { comments: comment._id } }, { new: true }
                )
                .exec()
                .then(post => {
                    console.log(post)
                    res.status(201).json({
                        message: "commented successfully",
                        comment: {
                            _id: comment._id,
                            postId: comment.postId,
                            createdAt: comment.createdAt,
                            createdBy: comment.createdBy
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                    Comment.findByIdAndDelete(comment._id)
                        .exec()
                        .then(deletedComment => {
                            console.log(deletedComment)
                            res.status(500).json({
                                message: "failed comment deleted"
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                message: "failed to comment",
                                error: err
                            })
                        })
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "failed to comment on post",
                error: err
            })
        })
}

exports.reply_to_comment = (req, res, next) => {
    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        body: req.body.body,
        createdAt: Date.now(),
        createdBy: {
            userId: req.body.userId,
            name: req.body.name
        }
    })

    comment
        .save()
        .then(comment => {
            Comment.findByIdAndUpdate(
                    req.params.commentId, { $push: { replies: comment._id } }, { new: true }
                )
                .then(repliedTo => {
                    console.log(repliedTo)
                    res.status(201).json({
                        message: "comment added",
                        repliedTo: {
                            _id: repliedTo._id,
                            body: repliedTo.body,
                            createdAt: repliedTo.createdAt,
                            createdBy: repliedTo.createdBy,
                            likes: repliedTo.likes,
                            replies: repliedTo.replies
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                    Comment.findByIdAndDelete(comment._id)
                        .exec()
                        .then(deletedComment => {
                            console.log(deletedComment)
                            res.status(500).json({
                                message: "failed reply deleted"
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                message: "failed to reply",
                                error: err
                            })
                        })
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "failed to reply",
                error: err
            })
        })
}

exports.like_comment = (req, res, next) => {
    const like = {
        likedBy: req.body.userId,
        likedAt: Date.now()
    }
    Comment.findByIdAndUpdate(
            req.params.commentId, { $push: { likes: like } }, { new: true }
        )
        .exec()
        .then(comment => {
            console.log(comment)
            res.status(201).json({
                message: "comment liked successfully"
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "failed to like comment",
                error: err
            })
        })
}


exports.get_all_posts2 = (req, res, next) => {
    Post.find()
        .exec()
        .then(post => {
            console.log(post)
            res.status(200).json(post)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "failed to fetch post",
                error: err
            })
        })
}
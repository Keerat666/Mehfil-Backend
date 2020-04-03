const mongoose = require("mongoose")

const commentSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	postId: mongoose.Schema.Types.ObjectId,
	body: { type: String },
	createdAt: { type: Number },
	createdBy: {
		userId: mongoose.Schema.Types.ObjectId,
		name: {
			firstName: { type: String },
			lastName: { type: String }
		}
	},
	likes: [
		{
			likedBy: mongoose.Schema.Types.ObjectId,
			likedAt: { type: Number }
		}
	],
	replies: []
})

module.exports = mongoose.model("Comment", commentSchema)

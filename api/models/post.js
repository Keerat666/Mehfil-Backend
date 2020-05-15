const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  body: { type: String },
  media: { type: String },
  aspectRatio: { type: Number },
  type: {
    type: String,
    match: /\b(image|video|text)\b/
  },
  createdAt: { type: Number },
  createdBy: {
    userId: mongoose.Schema.Types.ObjectId,
    name: {
      firstName: { type: String },
      lastName: { type: String }
    }
  },
  likes: [],
  saved: [
    {
      savedBy: mongoose.Schema.Types.ObjectId,
      savedAt: { type: Date, default: Date.now() }
    }
  ],
  comments: [],
});

postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", postSchema);

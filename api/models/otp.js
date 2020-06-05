const mongoose = require("mongoose")

const otpSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId : {type : mongoose.Schema.Types.ObjectId},
  otpval : {type : Number},
})

module.exports = mongoose.model("Otp", otpSchema)

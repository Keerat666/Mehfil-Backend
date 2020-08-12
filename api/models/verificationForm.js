const mongoose = require('mongoose')

const VerificationFormSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: { type: String },
  created_at: { type: Date },
  email: { type: String },
  name: {
    firstName: { type: String },
    lastName: { type: String }
  },
  profile_pic: {
    type: String,
    default:
      'https://lh3.googleusercontent.com/a-/AAuE7mBZOJf8xINXnRo1jQYYlIpMdS5CNVlermJMrlazpw=s96-c'
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED, REJECTED'],
    default: 'PENDING'
  },
  facebook: { type: String },
  instagram: { type: String },
  work_link: { type: String }
})

module.exports = mongoose.model('VerificationForm', VerificationFormSchema)

/* 
	{
		user_id: srd23wejkhdsbfuiojnioendkndwkqwd, 
		created_at: Date, 
		email: some@email.com, 
		status: PENDING,
		facebook: https://lh3.googleusercontent.com/a-/AAuE7mBZOJf8xINXnRo1jQYYlIpMdS5CNVlermJMrlazpw=s96-c, 
		instagram: 508113260794-4k8aicsp6lhc130va3d89i5s2mva6rc9.apps.googleusercontent.com,
		work_link: 508113260794-rak10dp64o401kssd2dejj5v1ubdh2dj.apps.googleusercontent.com
  }

*/

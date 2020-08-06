const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    firstName: { type: String },
    lastName: { type: String }
  },
  provider: { type: String, match: /\b(local|google|facebook)\b/ },
  providerId: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: { type: String },
  dob: { type: Number },
  description: { type: String, required: true },
  followers: [],
  following: [],
  username: { type: String, required: true, unique: true },
  profile_pic: {
    type: String,
    default:
      'https://lh3.googleusercontent.com/a-/AAuE7mBZOJf8xINXnRo1jQYYlIpMdS5CNVlermJMrlazpw=s96-c'
  },
  profession: [],
  genre: [],
  is_verified: { type: Boolean, default: false }
})

module.exports = mongoose.model('User', userSchema)

/* 

	{
		given_name: Nikhil, 
		locale: en, 
		family_name: Raj, 
		picture: https://lh3.googleusercontent.com/a-/AAuE7mBZOJf8xINXnRo1jQYYlIpMdS5CNVlermJMrlazpw=s96-c, 
		aud: 508113260794-4k8aicsp6lhc130va3d89i5s2mva6rc9.apps.googleusercontent.com,
		azp: 508113260794-rak10dp64o401kssd2dejj5v1ubdh2dj.apps.googleusercontent.com, 
		exp: 1582045725, 
		iat: 1582042125, 
		iss: https://accounts.google.com, 
		sub: 108765741067014995830, 
		name: Nikhil Raj, 
		email: nikhilraj1997@gmail.com, 
		email_verified: true}

*/

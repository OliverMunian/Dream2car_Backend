var mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    admin: Boolean,
    slot : [{type:mongoose.Schema.ObjectId, ref:'slots'}],
    booking: [{type: mongoose.Schema.ObjectId, ref:'bookings'}],
    password: String,
    token: String,
    profilePicture: String 
})


const User = mongoose.model('users', userSchema)

module.exports = User
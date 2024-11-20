var mongoose = require('mongoose')

const BookingSchema = mongoose.Schema({
   name: String,
   lastname: String,
   email: String,
   barber: {type:mongoose.Schema.ObjectId, ref:'user'},
   day: String,
   schedule: String,
   reservationNumber:String
})


const Booking = mongoose.model('Bookings', BookingSchema)

module.exports = Booking
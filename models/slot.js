var mongoose = require('mongoose')

const slotSchema = mongoose.Schema({
   day: String,
   schedule: String
})


const Slot = mongoose.model('slots', useslotSchemarSchema)

module.exports = User
var express = require("express");
var router = express.Router();
var Booking = require('../models/booking')
var User = require("../models/user")
const multer = require('multer');
const uid2 = require("uid2");



router.post('/:id', (req,res)=>{
    let reservationId = uid2(6);
    User.findOne({_id: req.params.id}).then((data)=>{
        if(data){
            const newBooking = new Booking({
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
                day: req.body.day,
                schedule:req.body.schedule,
                barber: data.id,
                reservationNumber: reservationId.toUpperCase()
            })
            newBooking.save().then((dataBooking)=>{
                if(dataBooking){
                    res.json({result: true, data: dataBooking})
                }else{
                    res.json({result:false, error: 'Impossible to book the event'})
                }
            })
        }else{
            res.json({result:false, error:'Barber not found !'})
        }
    })
})

//permet au client de retrouver sa reservation
router.get('/:id', (req,res)=>{
    Booking.findOne({reservationNumber: req.params.id}).then((data)=>{
        if(data){
            res.json({result:true, data: data})
        }else{
            res.json({result: false, error: 'Booking not found !'})
        }
    }).catch((error)=>{
        res.json({ result: false, error: 'Database error' });
    })
})

//Retrouver tous les booking
router.get('/all/:id', (req,res)=>{
    Booking.find({barber: req.params.id}).then((data)=>{
        if(data){
            res.json({result:true, data: data})
        }else{
            res.json({result: false, error: 'Booking not found !'})
        }
    }).catch((error)=>{
        res.json({ result: false, error: 'Database error' });
    })
})



router.get('/', (req, res) => {
    Booking.find().then((data) => {
        if (data) {
            res.json({ result: true, data });
        } else {
            res.json({ result: false, error: 'Bookings not found!' });
        }
    })
    .catch((error) => {
        console.error('Error during fetching:', error);
        res.json({ result: false, error: 'Database error' });
    });
});


router.delete('/cancel/:id', (req,res)=>{
    Booking.deleteOne({reservationNumber: req.params.id}).then((data)=>{
        if(data){
            res.json({result:true, data: data})
        }else{
            res.json({result: false, error: 'Booking not found !'})
        }
    }).catch((error)=>{
        res.json({ result: false, error: 'Database error' });
    })
})

module.exports = router;
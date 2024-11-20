var express = require("express");
var router = express.Router();
const Slot = require("../models/slots");


router.get('/appointments', (req, res) => {
 Slot.findAll().then((data)=>{
    if(data){
        res.json({result:true, data: data})
    }else{
        res.json({result:false,  error: 'Slots schedule not found'})
    }
 })
});

router.post('/appointments', (req, res) => {
  Slot.findOne({day: req.body.day,schedule: req.body.schedule
  }).then((data)=>{
    if (data){
        res.json({result:false,  error: 'This slots schedule cannot be book'})
    }else{
      const newSlot = new Slot({
        day: req.body.day,
        schedule: req.body.schedule,
        token: req.body.token
      })
    }
  })
});


module.exports = router;

var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const User = require("../models/user");
const uid2 = require("uid2");
const bcrypt = require("bcryptjs");
const path = require('path');
const multer= require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


router.post('/signup', (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  let token = uid2(32);

  User.findOne({ email: req.body.email }).then((data)=>{
    if(data == null){
      const newUser = new  User({
        username: req.body.username,
        email: req.body.email,
        admin: false,
        slot:[],
        booking:[],
        token : token,
        password: hash,
        profilePicture:null
      });
      newUser.save().then(data => {
        console.log(data)
        if(data){
          res.json({ result: true, data });
        }
        else{
          res.json({ result: false, error:'Impossible to register' });
        }
      });
    }else{
      res.json({ result: false, error:'User already exist' });
    }
  }).catch((error)=>{
    console.log(error)
    res.json({result: false, error})
  })
});

router.post('/signin', (req, res) => {
  User.findOne({email: req.body.email
  }).then((data)=>{
    if (data && bcrypt.compareSync(req.body.password, data.password )){
      res.json({result:true, data: data})
    }else{
      res.json({result:false,  error: 'User not found or wrong password'})
    }
  }).catch((error)=>{
    console.log(error)
    res.json({result: false, error})
  })
});


router.get('/:id', (req,res)=>{
  User.findOne({_id: req.params.id}).then((data)=>{
    if(data){
      res.json({result: true, data})
    }else{
      res.json({result: false, message: 'User not found !'})
    }
  }).catch((error)=>{
    console.log(error)
    res.json({result: false, error})
  })
})

router.get('/',(req,res)=>{
  User.find().then((data)=>{
    if(data){
      res.json({result:true, data})
    }else{
      res.json({result:true, message: 'Users not found'})
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).json({ result: false, error: 'Something went wrong' });
  });
})


router.post('/:id/profile-photo', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.json({ result: false, message: 'No file uploaded' });
  }

  // Utilisation du chemin relatif pour les images statiques
  const profilePicturePath = `/${req.file.filename}`;

  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (user) {
        // Mise à jour de la photo de profil
        return User.updateOne(
          { _id: req.params.id },
          { $set: { profilePicture: profilePicturePath } }
        ).then((updateResult) => {
          if (updateResult.modifiedCount > 0) {
            res.json({
              result: true,
              message: 'Profile updated successfully',
              profilePicture: profilePicturePath, // Renvoie le chemin relatif pour l'image
            });
          } else {
            res.json({ result: false, message: 'Profile not updated' });
          }
        });
      } else {
        res.json({ result: false, message: 'User not found' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ result: false, error: 'Something went wrong' });
    });
});




module.exports = router;

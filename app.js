//sk_test_51PDDLVDg73pK5OPoG1kIs2f4CjiawThPhjFNvsFpy3OOoqqPkYo3STyut7xUVUgpdGH8MHwaY5gBqscpBFigFfrw00fs9hx4Xf

const express = require('express')
var http = require('http')
var path = require('path')
var nodemailer = require('nodemailer')
var cors = require('cors')
const exp = require('constants')
require("dotenv").config();
const stripe = require('stripe')(process.env.NEXT_PUBLIC_SECRET_KEY)

const app = express()
var server = http.Server(app)
var port = 3000
app.set('port', port)
app.use(cors())
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "../pages/contact.js")))

app.post('/checkout', async (req,res)=>{
    const items = req.body.items
    let lineItems = []
    items.forEach((item)=>{
        lineItems.push({
            price : item.id,
            quantity: item.quantity
        })
    })
    const session = await stripe.checkout.sessions.create({
        line_items : lineItems,
        // line_items: [{
        //     price: "price_1PFxD3BTKVyKzYCyYxSG314D",
        //     // price_data:{
        //     //     currency : 'eur',
        //     //     product_data:{
        //     //         name: '1 participation au jeu concours'
        //     //     },
        //     // },
        //     quantity : 1
        // }],
        mode: 'payment',
        shipping_address_collection:{
            allowed_countries:['FR']
        },
        phone_number_collection:{ 
            'enabled': true,     
        },  
        // success_url:`${process.env.BASE_URL}/complete`,
        // cancel_url:`${process.env.BASE_URL}/cancel`
    })
    // res.redirect(session.url)
    res.json({
        url: session.url
    })
    console.log(res.json())
})

app.get('/complete',(req,res)=>{
    res.send('Votre paiement à été réalisé avec succès !')
})

app.get('/cancel',(req,res)=>{
    res.redirect('/')
})

app.get('/contact', (req,res)=>{
    res.sendFile(path.join(__dirname, "../pages/contact.js"))
})

app.post('/send',(req,res)=>{
    var name = req.body.name
    var email = req.body.email
    var phone = req.body.phone
    var message = req.body.message


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host:'smtp.gmail.com',
        auth:{
            type: "login",
            user: process.env.EMAIL_USER,
            pass: process.env.PASSWORD_EMAIL
        }
    })

    const mailOption ={
        from: email,
        to: 'omalahel@gmail.com',
        subject: `MESSAGE ${email} VIA DREAM2CAR - Tel: ${phone}`,
        text: message
    }

    transporter.sendMail(mailOption, function(error, infos){
        if(error){
            console.log(error)
            res.json({error : error})
        }else{
            console.log('Email send :' + infos.response)
            res.json({result:'le message a été envoyé avec succès'})
        }
        // res.redirect('/')
    })
})

// app.listen(3000, console.log('écoute sur le port 3000'))


module.exports = app;
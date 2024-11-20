require('dotenv').config();
require("./models/connection");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var port = process.env.PORT


var usersRouter = require('./routes/users');
var bookingRouter = require("./routes/bookings")
var app = express();

const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/assets', express.static(path.join(__dirname, 'public/uploads')));

app.use('/users', usersRouter);
app.use('/bookings', bookingRouter)



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = app;

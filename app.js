var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var cron = require('node-cron');
const axios = require('axios').default;
const Ethereum = require('./models/ethereum');
require('dotenv').config();

var indexRouter = require('./routes/index');
var transactionsRouter = require('./routes/transactions');
var ethereumRouter = require('./routes/ethereum');

const url = process.env.MONGO_URL;
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

cron.schedule('*/10 * * * *', () => {
  console.log('fetching ethereum price. (runs every 10 minutes)');
  getEthereumPrice()
});
async function getEthereumPrice() {
  try {
    const response = await axios.get(process.env.ETHEREUM_URL);
    const ethereumPrice = response.data.ethereum.inr

    var ethereumJson = new Ethereum({
      price: ethereumPrice
    });

    ethereumJson.save((err, doc) => {
      if (!err) {
        console.log("Saved ethereum price with no error")
      }
      else {
        console.log('Error during record insertion : ' + err);
      }
    });

  } catch (error) {
    console.error(error);
  }
}
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', transactionsRouter);
app.use('/', ethereumRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var firebase = require("firebase");

var index = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



var config = {
   apiKey: "AIzaSyDPYslRF9g8Vs5cnby72-cOHLyiosnqXNc",
   authDomain: "t-rain.firebaseapp.com",
   databaseURL: "https://t-rain.firebaseio.com",
   projectId: "t-rain",
   storageBucket: "t-rain.appspot.com",
   messagingSenderId: "474369892311"
};
firebase.initializeApp(config);



app.use(async function(req,res,next){

    let ref = firebase.database().ref('/dcard' );
    const getIP = async()=> ref.once('value').then(snapshot=>snapshot.val());

    const pushIP = async(puship)=>{
        const dateTime = Date.now();
        const timestamp = Math.floor(dateTime / 1000);
        return ref.push({
            "ip":puship,
            "create_at": timestamp
        }).then(()=>"success create").catch(err=>err);
    }

    let reqip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    if (reqip.substr(0, 7) == "::ffff:") {
        reqip = reqip.substr(7)
    }
    try {

        const loginIPlist = await getIP();
        const ipArray =  Object.values(loginIPlist);
        const nowTS = (Math.floor(Date.now() / 1000))
        const maxReqTimes = 1000;
        const limitTimeStamp = 3600;

        let wantIPArray = ipArray.filter(ele=>ele.ip == reqip)
                                 .filter(ele=>ele.create_at>(nowTS-limitTimeStamp));
        let times = wantIPArray.length;

        if(times <= maxReqTimes-1){
            res.set("X-RateLimit-Remaining",maxReqTimes-1-times);
            switch (times) {
                case 0:
                    res.set("X-RateLimit-Reset",nowTS+limitTimeStamp);
                    break;
                default:
                    res.set("X-RateLimit-Reset",wantIPArray[0].create_at+limitTimeStamp);
            }
            const state = await pushIP(reqip);
            next();
        }else{
            var err = new Error('Too Many Reqyest');
            err.status = 429;
            next(err);
        }
    } catch (e) {
        console.log(e);
    }


});




app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

var userRoute = require('./routers/users');
var authenticateRoute = require('./routers/authenticate');
var googleRoute = require('./routers/google');

var categoryRoute = require('./routers/categories');
var sourceRoute = require('./routers/sources');
var articleRoute = require('./routers/articles');
var headlineRoute = require('./routers/top-headlines');

var config = require('./config');

var port = config.app.port;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cors());
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With, Content-Type, Authorization');
    next();
});

app.use(morgan('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(config.db.connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if (err){
        console.log("Mongo connected fail!");
    }else{
        console.log("Mongo connected")
    }
});
mongoose.set('useCreateIndex',true);
mongoose.set('useFindAndModify', false);

app.use('/users', userRoute);
app.use('/authenticate', authenticateRoute);
app.use('/google', googleRoute);


app.use('/categories', categoryRoute);
app.use('/sources', sourceRoute);
app.use('/articles', articleRoute);
app.use('/top-headlines', headlineRoute);


mongoose.set('useCreateIndex', true);
app.listen(port);
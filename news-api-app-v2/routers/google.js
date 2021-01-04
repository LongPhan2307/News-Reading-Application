var express = require('express');
var router = express.Router();
var passport = require('passport');
var verifyToken = require('../helper/verifyToken');

var cookieSession = require('cookie-session');



router.use(cookieSession({
    secret: 'AppSecret',
    resave: false,
    saveUninitialized: true}
  ));

  router.use(passport.initialize());

  
  router.get('/login', function(req,res){
    require('../helper/google/login');
    res.redirect('/google/redirect');
  })
  
  router.get('/redirect', passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get('/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    console.log(req.user);
    res.json({ success: true, message: "Successful login", token: req.user.token, code: req.user.code});
    //res.end('Logged in!');
  })

module.exports = router;
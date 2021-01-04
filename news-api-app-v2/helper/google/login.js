const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var {nanoid} = require('nanoid');
require('dotenv').config();

var User = require('../../models/User');
var Writer = require('../../models/Writer');

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({google: profile.id}, 'isAdmin username token', function(err, account) {
        if (err){
          return done(err);
        } 
        if (account){
          var token = account.createTokenUser();
          var verifyAdmin;
          if(account.isAdmin){
            var verifyAdmin = account.createTokenAdmin();
            return done(null, {token: token, code: verifyAdmin});
          }
          console.log("verifyAdmin");
          return done(null, {token: token});
        } else {
          var user = new User();
          console.log(profile);
          user.username = profile.emails[0].value;
          user.password = nanoid(10);
          console.log("this is a new user");
          user.google = profile.id;
          user.token = accessToken;
          user.createTokenUser();
          user.save(function(err){
            if(err) {
              if (err.code == 11000){
                console.log("username already exists");
                return done('username already exists');
              }
            };
            var writer = new Writer();
            writer.name = profile.displayName;
            writer.user = user._id;
            writer.email = profile.emails[0].value;
            writer.save(function(err){
              if (err) throw err;
              return done(null, user);
            })
        });
        }
      })
    })
  }
));

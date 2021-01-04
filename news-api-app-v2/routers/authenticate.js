var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.post('/logout', function (req, res, next) {
    res.json({
        success: true,
        message: "Logged out successfully"
    });
});
router.post('/login', function (req, res, next){
    User.findOne({
        username: req.body.username
    })
    .select('_id isAdmin username password').exec(function (err, user) {
        if (err) throw err;
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found. '
            });
        } else if (user) {
            var validPassword = user.comparePassword(req.body.password);
            if(!validPassword){
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found. '
                });
            } else {
                var token = user.createTokenUser();
                var verifyAdmin = user.verifyAdmin();
                if(verifyAdmin){
                    res.json({success: true, message: 'Successful login',user: user, code: user.createTokenAdmin()}).status(200);
                    console.log("admin");
                    
                } else {
                    res.json({success: true, message: 'Successful login',user: user}).status(200);
                    console.log("user");
                }
                user.save(function(err) {
                    if(err) return res.send(err);
                    
                })
                
            }
        }
    })
});

module.exports = router;
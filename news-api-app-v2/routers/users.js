var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Writer = require('../models/Writer');
var verifyAdmin = require('../helper/verifyAdmin');

router.get('/', verifyAdmin, function (req, res, next){
    User.find(function(err,users){
        if(err) return res.send(err);
        // return the users
        res.json(users);
    });
})
router.post('/register', function (req, res, next){
    var user = new User(); 
    user.username = req.body.username;
    user.password = req.body.password;
    user.save(function(err){
        if(err){
            if(err.code == 11000)
                return res.json({ success: false, message:'A user already exists.'});
                else
                return res.send(err);
        }
            var writer = new Writer();
            writer.name = req.body.name;
            writer.phone = req.body.phone;
            writer.address = req.body.address;
            writer.user = user._id;
            writer.save(function(err){
                if (err) {
                    return res.send(err);
                } else {
                    res.json({success: true, message: 'User created!!!'});
                }
            })
    });
})
router.get('/:user_id', function (req, res){
    User.findById(req.params.user_id, function (err,user) {
        if(err) return res.send(err);
        if(!user) return res.json({success:false, message:'User not found.'});
        res.json({success: true, data: user});
    });
})

module.exports = router;
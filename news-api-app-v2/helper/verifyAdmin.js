var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {
    var userToken = req.headers['admin-access-token'];
    var superSecret = config.app.superSecret;
    if(userToken){
        jwt.verify(userToken, superSecret, function(err, decoded){
            if(err){
                
                return res.json({ success: false, message: "You are not admin"});
            } else {
                next();
            }
        });
    } else {
        return res.status(403).send({ 
            success: false,
            message: 'No token provided.'
        });
    }
}
router.use(verifyToken);

module.exports = router;
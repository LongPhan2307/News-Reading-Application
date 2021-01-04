var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    var userToken = req.headers['token'];
    var superSecret = req.headers['user'];
    console.log('Verify Token');
    if(userToken){
        jwt.verify(userToken, superSecret, function(err, decoded){
            if(err){
                return res.json({ success: false, message: "Failed to authenticate token"});
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
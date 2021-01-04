var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var config = require('../config');

var UserSchema = new Schema({
    username: {type: String, required: true, unique: true },
    password: {type: String, required: true, select: false },
    isAdmin: {type: Boolean, required: true, select: false, default: false},
    google: {type: String, default: ""},
    facebook: {type: String, default: ""},
    token: String,
});
UserSchema.pre('save', function(next) {
    var user = this;
    next();
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});
UserSchema.methods.comparePassword = function(password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

UserSchema.methods.verifyAdmin = function() {
    var user = this;
    return user.isAdmin;
}

UserSchema.methods.createTokenUser = function() {
    var token = jwt.sign({
        username: this.username,
        token: this.token
    }, 
    this.username, 
    {
        expiresIn: '3m'
    });
    this.token = token;
    return token;
}

UserSchema.methods.createTokenAdmin = function() {

    var token = jwt.sign({
        username: this.username,
        token: this.token
    }, config.app.superSecret, {
        expiresIn: '3m',
    });
    return token;
}

UserSchema.methods.verifyUser = function() {
    var userToken = this.token;
    var superSecret = this.username;
    if(userToken){
        var result = jwt.verify(userToken, superSecret, function(err, decoded){
            if(err){
                return false;
            } else {
                return true;
            }
        });
        return result;
    } 
}
module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config');


const articleSchema = new mongoose.Schema({
    source: {
        _id: {type: mongoose.Schema.Types.ObjectId, default: null},
        name: {type: String, default: null}
    },
    author: String,
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: {type: Date, default: null},
    content: String,
    writerAccount: {type: String, required: true},
    isDeleted: {type: Boolean, required: true, default: false},
});

articleSchema.methods.verifyUser = function(token) {
    var article = this;
    var userToken = token;
    console.log(userToken);
    var superSecret = article.writerAccount;
    if(userToken){
        var result = jwt.verify(userToken, superSecret, function(err, decoded){
            if(err){
                console.log(err);
                return false;
            } else {
                return decoded.username === article.writerAccount;
            }
        });
        return result;
    } 
};
articleSchema.methods.verifyAdmin = function(token) {
    var article = this;
    var userToken = token;
    console.log(userToken);
    var superSecret = config.app.superSecret;
    if(userToken){
        var result = jwt.verify(userToken, superSecret, function(err, decoded){
            if(err){
                console.log(err);
                // verify token admin here
                return false;
            } else {
                return decoded.username === article.writerAccount;
            }
        });
        return result;
    } 
};
module.exports = mongoose.model("Article", articleSchema);
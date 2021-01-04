var express = require('express');
const { token } = require('morgan');
var router = express.Router();
var Article = require('../models/Article');
var verifyToken = require('../helper/verifyToken');


router.get('/', function (req, res, next){
    if(req.query.user === undefined){
    res.json({status: "error", message: "Required parameter"});
    } else if(req.query.user != undefined){
        console.log(req.query.user);
        Article.find({$and: [
            {isDeleted: false},
            {writerAccount: req.query.user}
        ]}).select('author title description url urlToImage content')
        .exec(function(err,articles) {
            if (err) return res.send(err);
            res.json({status: "ok", articles: articles});
        });
    }
})

router.post('/', verifyToken, function (req, res, next){
    var article = new Article(); 
    article.author = req.body.author;
    article.title = req.body.title;
    article.description = req.body.description;
    article.url = req.body.url;
    article.urlToImage = req.body.urlToImage;
    article.content = req.body.content;
    article.writerAccount = req.headers.user;
    article.save(function(err){
        if(err){
            return res.send(err);
        } else {
            res.json({success: true, message: 'Article created!!!'});
        }
    });
})
router.get('/:article_id', function (req, res, next){
    Article.findById(req.params.article_id, function(err,article){
        if(err) return res.send(err);
        res.json(article);
    });
})
router.delete('/:article_id', verifyToken, function(req, res, next){
    Article.findById(req.params.article_id, function(err, article){
        if(err) return res.send(err);
        if(!article) return res.json({success: false, message: "Article not found"});
        article.isDeleted = true;
        console.log("result: ");
        var verifyUser = article.verifyUser(req.headers['token']);
        console.log(verifyUser);
        if(verifyUser){
            article.save(function(err){
                if(err) return res.send(err);
                res.json({message: 'Successfully delete'});
            })
        } else {
            res.json({message: 'You are not authorized to change the content'});
        }       
    })
})
router.put('/:article_id', verifyToken, function(req, res, next){
    Article.findById(req.params.article_id, function(err, article){
        if(err) return res.send(err);
        if(!article) return res.json({success: false, message: "Article not found"});
        if(req.body.author) article.author = req.body.author;
        if(req.body.title) article.title = req.body.title;
        if(req.body.description) article.description = req.body.description;
        if(req.body.url) article.url = req.body.url;
        if(req.body.urlToImage) article.urlToImage = req.body.urlToImage;
        if(req.body.content) article.content = req.body.content;
        console.log("result: ");
        var verifyUser = article.verifyUser(req.headers['token']);
        console.log(verifyUser);
        if(verifyUser){
            article.save(function(err){
                if(err) return res.send(err);
                res.json({message: 'Successfully updated'});
            })
        } else {
            res.json({message: 'You are not authorized to change the content'});
        }       
    })
})



module.exports = router;
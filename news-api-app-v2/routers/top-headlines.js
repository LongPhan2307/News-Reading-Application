var express = require('express');
const { token } = require('morgan');
var router = express.Router();
var Article = require('../models/Article');
var Source = require('../models/Source');
var Category = require('../models/Category');
var verifyAdmin = require('../helper/verifyAdmin');
var verifyToken = require('../helper/verifyToken');

router.get('/', function (req, res, next){
    if(req.query.source_id === undefined && req.query.category_name === undefined && req.query.new === undefined){
    res.json({status: "error", message: "Required parameter"});
    } else if(req.query.source_id != undefined){
        Source.findOne({_id: req.query.source_id}, function(err,source){
            if(err) return res.send(err);

            Article.find({$and: [
                {isDeleted: false},
                {_id: {$in: source.articles}}
            ]}).select('source author title description url urlToImage content publishedAt')
            .exec(function(err,articles) {
                if (err) return res.send(err);
                res.json({status: "ok", articles: articles});
            });

        });
     }
    else if(req.query.category_name != undefined){
        Category.findOne({name: req.query.category_name}, function(err,category){
            if(err) return res.send(err);
            if(!category.sources) return res.send('Source not found');
            Source.find(
                {_id: {$in: category.sources}},
                function(err, sources){
                if(err) return res.send(err);
                var articles = [];
                sources.forEach(function(source){
                    source.articles.forEach(function(article){
                        articles.push(article);
                    });
                });
                Article.find({$and: [
                    {isDeleted: false},
                    {_id: {$in: articles}}
                ]},'source author title description url urlToImage content publishedAt',
                function(err, articles){
                    res.json({status: "ok", articles: articles});
                });
                
            });
        });
    } else if(req.query.new == "yes"){
        var startDate = new Date();
        startDate.setDate(startDate.getDate() - 2);
        Article.find({$and: [
            {isDeleted: false},
            {publishedAt: {$gte: startDate}}
        ]},'source author title description url urlToImage content publishedAt',
        function(err, articles){
            res.json({status: "ok", articles: articles});
        });
    }
    
})
router.put('/:article_id', verifyAdmin, function (req, res, next){
    Source.findOneAndUpdate({
        _id: req.query.source_id}, 
        {$push: {articles: req.params.article_id}},
        function (err, source){
            if (err)return res.send(err);
            if (!source){return res.send("Can not find source")};
            console.log(source);
            var date = Date.now();
            Article.findByIdAndUpdate(
                req.params.article_id,
                {source: {_id: source._id, name: source.name}, publishedAt: date},
                function(err, article){
                    console.log(article);
                    if(err) return res.send(err);
                    if(!article) return res.send({success: false, message: "Article not found"});
                    res.json({success: true, message: "Success add article"});
                })
        });
})

router.delete('/:article_id', verifyAdmin, function(req, res, next){
    Source.findOneAndUpdate({
        _id: req.query.source_id},
        {$pullAll: { articles: [ req.params.article_id ] }},
        function(err, source){
            if (err) return res.send(err);
            if (!source){ res.send("Can not find source")};
            Article.findByIdAndUpdate(
                req.params.article_id,
                {source: {_id: null, name: source.name}, publishedAt: null},
                function(err, article){
                    console.log(article);
                    if(err) return res.send(err);
                    if(!article) return res.send({success: false, message: "Article not found"});
                    res.json({success: true, message: "Success remove article"});
                })
        })
})


module.exports = router;
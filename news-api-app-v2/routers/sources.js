var express = require('express');
const { token } = require('morgan');
var router = express.Router();
var Source = require('../models/Source');
var Category = require('../models/Category');
var verifyAdmin = require('../helper/verifyAdmin');

router.get('/', function (req, res, next){
    if(req.query.category_name === undefined){
    Source.find(function(err, sources){
        if(err) return res.send(err);
        res.json({sources: sources});
    });
    } else {
        Category.findOne({name: req.query.category_name}, function(err,category){
            if(err) return res.send(err);
            if(!category) return res.send("Category not found");
            Source.find(
                {_id: {$in: category.sources}},
                function(err, sources){
                if(err) return res.send(err);
                res.json({sources: sources});
            });
        });
    }
})
router.post('/', verifyAdmin, function (req, res, next){
    var source = new Source(); 
    source.name = req.body.name;
    source.url = req.body.url;
    source.urlToImage = req.body.urlToImage;
    source.articles = [];
    source.save(function(err){
        if(err){
            return res.send(err);
        }
        res.json({success: true, message: 'Source created!!!'});
    });
})
router.get('/:source_id', function (req, res, next){
    Source.findById(req.params.source_id, function(err,source){
        if(err) return res.send(err);
        res.json(source);
    });
})
router.delete('/:source_id', verifyAdmin, function(req, res, next){
    Category.findOneAndUpdate(
        {name: req.query.category_name},
        {$pullAll: { sources: [ req.params.source_id ] }},
        function(err, category){
            if(err) {
                return res.send(err);
            }
            console.log(category);
            if(!category){res.send({success: false, message: 'Category not found'})}
            else {
                res.json({success: true, message: 'Success remove source'});
            }
        }
    )
})
router.put('/:source_id', verifyAdmin, function(req, res, next){
    Category.findOneAndUpdate(
        {name: req.query.category_name},
        {$push: {sources: req.params.source_id}},
        function(err, category){
            if(err) {
                return res.send(err);
            }
            console.log(category);
            if(!category){res.send({success: false, message: 'Category not found'})}
            else {
                res.json({success: true, message: 'Success add source'});
            }
        }
    )
})



module.exports = router;
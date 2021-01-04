var express = require('express');
const { token } = require('morgan');
var router = express.Router();
var Category = require('../models/Category');
var verifyAdmin = require('../helper/verifyAdmin');

router.get('/', function (req, res, next){
    Category.find(function(err, categories){
        if(err) return res.send(err);
        res.json({status:'ok', categories: categories});
    });
})
router.post('/', verifyAdmin, function (req, res, next){
    var category = new Category(); 
    category.name = req.body.name;
    category.url = req.body.url;
    category.sources = [];
    category.save(function(err){
        if(err){
            return res.send(err);
        }
            res.json({success: true, message: 'Category created!!!'});
    });
})
router.get('/:category_id', function (req, res, next){
    Category.findById(req.params.category_id, function(err,category){
        if(err) return res.send(err);
        res.json(category);
    });
})

router.delete('/:category_id', verifyAdmin, function(req, res, next){
    Category.deleteOne({
        _id: req.params.category_id
    },function(err, category){
        if(err) return res.send(err);
        res.json({message: 'Successfully deleted!!!!!!!!'});
    });
})
router.put('/:category_id', verifyAdmin, function(req, res, next){
    Category.findById(req.params.category_id, function(err, category){
        if(err) return res.send(err);
        if(!category) return res.json({success: false, message: "Category not found"});
        if(req.body.name) category.name = req.body.name;
        if(req.body.url) category.url = req.body.url;
        category.save(function(err){
            if(err) return res.send(err);

            res.json({message: 'Successfully updated'});
            
        })
    })
})
module.exports = router;
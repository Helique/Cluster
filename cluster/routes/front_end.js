/**
 * Created by david.bernadett on 8/27/16.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
router.get('/',function(req,res){
    res.sendFile(path.resolve('public/index.html'));
});
module.exports = router;
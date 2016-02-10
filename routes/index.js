var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

//router.get("/login", function(req,res){
//  res.status(200).json(req.user);
//  console.log("req.user: ", req.user);
//});
//


module.exports = router;

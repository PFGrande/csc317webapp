var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"Pedro" });
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.get('/postvideo', function(req, res) {
  res.render('postvideo');
});

router.get('/viewpost', function (req, res) { //set client ID later on.
  res.render('viewpost');
});

router.get('/profile', function (req, res) {
  res.render('profile')
});

module.exports = router;

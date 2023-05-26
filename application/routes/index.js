var express = require('express');
const {isLoggedIn} = require("../middleware/auth");
const {getRecentPosts} = require("../middleware/posts");
var router = express.Router();

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  res.render('index', { title: 'CSC 317 App / Home', name:"Pedro", description: 'Welcome to the home of Americas best lineups!'})/*, javaScript: ['showposts.js']*/
});

router.get('/login', function (req, res) {
  res.render('login', {title: 'Log in', description: 'enter account credentials'});
});

router.get('/registration', function(req, res) {
  res.render('registration', {title: 'Registration', description: 'Please register an account to post videos', javaScript: ['authorize.js']});
});

router.get('/postvideo', isLoggedIn, function(req, res) {
  res.render('postvideo', {title: 'Upload', description: 'Here you can upload video files'});
});


module.exports = router;

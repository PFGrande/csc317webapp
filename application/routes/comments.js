/*route that deals with comments*/
var express = require('express');
const {isLoggedIn} = require("../middleware/auth");
var router = express.Router();

// router('/create', isLoggedIn,function (req, res, next) { //creating comments
//     res.status(201).json(req.body); //resource created, return req.body
//
// });



















module.exports = router;
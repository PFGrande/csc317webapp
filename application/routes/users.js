var express = require('express');
var router = express.Router();
var db = require('../conf/database');
/* GET users listing. (localhost:3000/users) */
/*keep watching video at 1:06:55 : CSC 317 Joins, db setup...*/
router.get('/', async function(req, res, next) {
  //res.send('respond with a resource');
  db.query('select * from users;', function(error, rows){
    if(error) {
      next(error); //error handled if there is one, anything passed into next() is assumed to be an error except if 'route' is passed in

    } else {
      //user "sources" in browser dev tools to view the json objects
      res.status(200).json({rows}); //returns table rows to the front end
    }
  })
});


module.exports = router;

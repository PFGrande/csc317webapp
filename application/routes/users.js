var express = require('express');
var router = express.Router();
var db = require('../conf/database');
/* GET users listing. (localhost:3000/users) */
/*keep watching video at 1:06:55 : CSC 317 Joins, db setup...*/
/*prints table elements as objects to the console (for debugging purposes)*/
router.get('/', async function(req, res, next) {
  //res.send('respond with a resource');
  /*db.query('select * from users;', function(error, rows){
    if(error) {
      next(error); //error handled if there is one, anything passed into next() is assumed to be an error except if 'route' is passed in

    } else {
      //user "sources" in browser dev tools to view the json objects
      res.status(200).json({rows}); //returns table rows to the front end
    }
  })*/
  try {
    let [rows, fields] = await db.query(`select * from users`); //promises for query and execute return array
    res.status(200).json({rows, fields})
  } catch (error) {
    next(error);
  }

});

/*routing for localhost:3000/user/registration */
router.post('/registration', async function(req, res, next) {
  console.log(req.body);
  res.end();
});


module.exports = router;

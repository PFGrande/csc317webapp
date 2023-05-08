var express = require('express');
var router = express.Router();
var db = require('../conf/database');
/* GET users listing. (localhost:3000/users) */
/*keep watching video at 1:06:55 : CSC 317 Joins, db setup...*/

/*
Notes:
  The middleware is loaded into the stack after a request is fulfilled (it is also loaded into the stack before
  code is executed).
    This means that every request will have the same middleware.
  The order of middleware functions is that of which they are defined.
    .use indicates a middleware function being added to the stack.
 */

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
  /* Prints registration data on  */
  try {
    let [rows, fields] = await db.query(`select * from users`); //promises for query and execute return array
    res.status(200).json({rows, fields})
  } catch (error) {
    next(error);
  }

});

/*server side validation */
/*
router.use("/registration", function(req, res, next) {
  //it is optional to validate data here, assume data is already clean due to using validation.js
});*/

/*routing for localhost:3000/user/registration */
//Left off at 36:13, remember to rewatch bcrypt lecture
//request handler for the registration page, parameters: route path, handler function
router.post('/registration', async function(req, res, next) {
  //destructure json object.
  let {username, email, password} = req.body;

  //Check uniqueness of values: A sessionID can be created after the user's account is inserted into the database (not necessary)
  try { //promise
    //Username uniqueness check
    var [rows, fields] = await db.execute(`select id from users where username=?;`,[username]); //don't use ${username}, could lead to SQL injection
    //passing username as array can also lead to injection, to avoid injection we use db.execute which
    // db.execute removes floating characters from the username

    //rows.length = # of usernames that matched the input username.
    if (rows && rows.length > 0) {// if no similar usernames found, redirect to registration page
      return res.redirect('/registration');//function breaks & website refresh if matching username found (rows.length > 0)
    }

    //email uniqueness check
    var [rows, fields] = await db.execute(`select id from users where email=?;`,[email]);

    if (rows && rows.length > 0) {
      return res.redirect('/registration');//function breaks & website refresh if matching email found (rows.length > 0)
    }

    //encrypt password before inserting it into db

    //insert data into the database (inserts rows into DB)
    //result object = new row being input, fields is the columns?
    var [resultObject, fields] = await db.execute(`INSERT INTO users (username, email, password) value (?,?,?);`, [username, email, password]);

    //console.log(resultObject); //print object being input into user table, result object contains the id for new row :)
    //res.end(); //ends request

    //response:
    //resultObject will not be null & the affected rows should be 1.
    //This statement checks for a successful insert.
    if (resultObject && resultObject.affectedRows) { //if resultObject != NULL && resultObject.affectedRows != NULL
      res.redirect('/login'); //object inserted into row, proceed to login page
    } else {
      return res.redirect('/registration'); //object not inserted, reload registration page
    }


  }catch (error) {
    next(error);
  }

  //console.log(req.body); prints user data
  //res.end(); send response back to the client
  //uniqueness checks will happen here (for practice)
});




module.exports = router;

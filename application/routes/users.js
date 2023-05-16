var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt');
var { isLoggedIn, isMyProfile } = require("../middleware/auth.js");
const {usernameCheck, isUsernameUnique, isEmailUnique, passwordCheck} = require("../middleware/validation");

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
//request handler for the registration page, parameters: route path, handler function
router.post('/registration', usernameCheck, passwordCheck, isUsernameUnique, isEmailUnique, async function(req, res, next) {
  //destructure json object.
  let {username, email, password} = req.body;

  try { //promise
    //encrypt password before inserting it into db
    let hashedPassword = await bcrypt.hash(password, 3);

    //insert data into the database (inserts rows into DB)
    //result object = new row being input, fields is the columns?
    var [resultObject, fields] = await db.execute(`INSERT INTO users (username, email, password) value (?,?,?);`, [username, email, hashedPassword]);

    //resultObject will not be null & the affected rows should be 1.
    //This statement checks for a successful insert.
    if (resultObject && resultObject.affectedRows) { //if resultObject != NULL && resultObject.affectedRows != NULL
      return res.redirect('/login'); //object inserted into row, proceed to login page

    } else {
      return res.redirect('/registration'); //object not inserted, reload registration page

    }


  }catch (error) {
    next(error);
  }

});

//LOG IN:
//Define route and use route handler function for login:
router.post('/login', async function(req, res, next) {
  //execute data check on the database: (should I assume the data being submitted has been sanitized?)
  let {username, password} = req.body; //I believe login request only contains these two values in the request body

  if (!username || !password) { //make sure username and password fields aren't empty
    return res.redirect('/login');
  }

  //Search for hashed password and username in DB
  var [rows, fields] = await db.execute(`SELECT id,username,password,email FROM users where username=?;`, [username]); //if a row is returned, login user

  let user = rows[0]; //grabs user in row

  if (!user) {
    req.flash("error", `Login Failed: Invalid Username or Password`); //user not found in DB
    req.session.save(function(err) { //ensures async function (req.flash) finishes executing before value is returned.
        return res.redirect("/login");

    });
  } else {
    var passwordsMatch = await bcrypt.compare(password, user.password);
      if(passwordsMatch) {
        //add session object to DB.
        //session object contains: ID, email, username
        //Using the whole object would provide unnecessary data, such as the hashed password.
        req.session.user = {
          userID: user.id,
          email: user.email,
          username: user.username
        };
        req.flash("success", `Login Successful`);

        req.session.save(function(err) {
            return res.redirect("/");
        });

      } else {
        req.flash("error", `Login Failed: Invalid Username or Password`);
        req.session.save(function(err) { //ensures async function (req.flash) finishes executing before value is returned.
          return res.redirect("/login");

        });
      }
  }

});

/*ensure that only profile owners can view their own profile*/
/* transfered code to auth document, why does it have a different effect than my middleware? is it because of "return"?
router.use(function (req, res, next) {
  if(req.session.user) {
      next(); //if signed in, allow user to see profile
  } else {
      return res.redirect('/login'); // if not signed in, send to login page
  }
});*/


//router.use("/profile/:id(\\d+)", isMyProfile);
//router.use("/profile/:id(\\d+)", isLoggedIn);
//ensures ID is integer
router.get("/profile/:id(\\d+)", isLoggedIn, isMyProfile, function (req, res) {
  console.log(req.params); //prints id of logged in user
  res.render('profile', {title: 'Profile'});
});

//destroy current user's session
//there can't be a flash message here because session gets destroyed, flash message requries a session
router.post('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    //in case of an error (error handler)
      if (err) {
        next(err);
      }
      return res.redirect('/');
  });
});



module.exports = router;

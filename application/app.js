require('dotenv').config();
const createError = require("http-errors");
const express = require("express");
const favicon = require('serve-favicon');
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const handlebars = require("express-handlebars");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

//import express session module
const sessions = require('express-session');
const mysqlStore = require('express-mysql-session')(sessions);
const flash = require('express-flash');

app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"), //where to look for layouts
    partialsDir: path.join(__dirname, "views/partials"), // where to look for partials
    extname: ".hbs", //expected file extension for handlebars files
    defaultLayout: "layout", //default layout for app, general template for all pages in app
    helpers: {
        nonEmptyObject: function(obj) {
            //return: objectExists && passed in value is an object && object's set of keys > 0
            return obj && obj.constructor === Object && Object.keys(obj).length > 0;
        }
    }, //adding new helpers to handlebars for extra functionality
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//create mysql store object that accesses the application's database
const sessionStore = new mysqlStore({/*empty because we are using default options*/}, require('./conf/database'));
//documentation of default options under options section: https://www.npmjs.com/package/express-mysql-session#options

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("csc 317 secret"));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use("/public", express.static(path.join(__dirname, "public")));

//session configuration
app.use(sessions({
    secret: "csc 317 secret",
    resave: false,
    saveUninitialized: true, // generate session data for data for non-logged in users
    store: sessionStore, //store the session in the sessionStore
    cookie: { // cookie object
        httpOnly: true, // inaccessible by client-side JS
        secure: false // security authorities not set up so we are using unencrypted traffic
    }
}));

//flash needs sessions, flash must be placed after sessions
//on every request, flash message will occur
app.use(flash())

//print session | later on: move data from session obj to the template so handlebars can use it:
app.use(function (req, res, next) {
   console.log(req.session); //for debugging, prints request for session
   if (req.session.user) { //check if session exists
       res.locals.isLoggedIn = true; //puts data on all templates
       res.locals.user = req.session.user;
   }
   next();
});


app.use("/", indexRouter); // route middleware from ./routes/index.js
app.use("/users", usersRouter); // route middleware from ./routes/users.js


/**
 * Catch all route, if we get to here then the 
 * resource requested could not be found.
 */
app.use((req,res,next) => {
  next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
})
  

/** note: handles error from users.js in db.query()
 * Error Handler, used to render the error html file
 * with relevant error information.
 */
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

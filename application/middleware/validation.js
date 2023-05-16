var validator = require('validator'); // import validator module
const db = require("../conf/database"); // import database
//const specialChars = ['\\/', '\\*', '\\-', '\\+', '\\!', '\\@', '\\#', '\\$', '\\^', '\\&', '\\~', '\\[', '\\]'];
/*note work on confirm password later, and also work on showing the user what they're entering wrong before submitting the form*/
module.exports = {
    usernameCheck: function (req, res, next) {
        var {username} = req.body; //destructure body
        // look for the error cases to inform the user of them
        username = username.trim();// removes empty space on both sides
        //username = username.replace(/\s/g, ""); ask prof. how ethical it is to remove chars from username
        //doubt it is, added it as error instead

        if(!validator.isLength(username, {min:3})) {
            req.flash("error", `Username: must be 3 or more characters`);
        }
        if(!/[a-zA-Z]/.test(username.charAt(0))) {
            req.flash("error", `Username: must begin with a character`);
        }
        if(username.includes(" ")) {
            req.flash("error", `Username: must not contain spaces`);
        }

        if(req.session.flash.error) { // if true = error
            res.redirect('/registration');
        } else {
            next();
        }

    },
    passwordCheck: function (req, res, next) { //confirm password is on the front end
        var {password} = req.body;

        if(!validator.isLength(password, {min:8})) {
            req.flash("error", `Password: must be 8 or more characters`);
        }

        if(password.includes(" ")) {
            req.flash("error", `Password: must not contain spaces`);
        }

        // if(!/[a-z]/.test(password)) {
        //     req.flash("error", `Password: must be alphanumeric (a-z)`);
        // } no requirement for there to be at least one lowercase letter

        if(!/\d/.test(password)) {
            req.flash("error", `Password: must contain a number (0-9)`)
        }

        if(!/[A-Z]/.test(password)) {
            req.flash("error", `Password: must contain at least one uppercase letter (A-Z)`);
        }

        if(req.session.flash.error) { // if true = error
            res.redirect('/registration');
        } else {
            next();
        }

        // if(!function () {
        //     for (let i = 0; i < specialChars.length; i++) {
        //         if (password.includes(specialChars[i])) {
        //             return true;
        //         }
        //     }
        // }) {
        //     req.flash("error", `Password: must contain one special character: / * - + ! @ # $ ^ & ~ [ ]`);
        // }
        // let passwordStrength = validator.isStrongPassword(password, {
        //     minLength: 8,
        //     minLowercase: 1, //there was no speficification if the user should have at least one lowercase, I included one anyways
        //     minUppercase: 1,
        //     minNumbers: 1,
        //     minSymbols: 1,
        //     returnScore: true //score won't be returned, might use to display password strength in front end
        //
        // });
        //
        // if (!passwordStrength.isValid) {
        //     let reasons = passwordStrength.
        // }

    },
    emailCheck: function (req, res, next) {},
    tosCheck: function (req, res, next) {},
    ageCheck: function (req, res, next) {},
    isUsernameUnique: async function (req, res, next) {
        var {username} = req.body;
        try {
            var [rows, fields] = await db.execute(`select id from users where username=?;`,[username]); //don't use ${username}, could lead to SQL injection
            //passing username as array can also lead to injection, to avoid injection we use db.execute which
            // db.execute removes floating characters from the username

            //rows.length = # of usernames that matched the input username.
            if (rows && rows.length > 0) {// if no similar usernames found, redirect to registration page
                req.flash("error", `Username: "${username}" is already taken`);
                req.session.save(function (err) {
                    return res.redirect('/registration');//function breaks & website refresh if matching username found (rows.length > 0)
                });
             } else {
                next();
            }

        } catch (error) {
            next(error);
        }
    },
    isEmailUnique: async function (req, res, next) {
        var {email} = req.body;
        try {
            var [rows, fields] = await db.execute(`select id from users where email=?;`,[email]);

            if (rows && rows.length > 0) { // if email taken
                req.flash("error", `Email: "${email}" is already in use`)
                req.session.save(function(err) {
                    return res.redirect('/registration');//function breaks & website refresh if matching email found (rows.length > 0)
                });
            } else {
                next();
            }
        } catch (error) {
            next(error);
        }
    }

};
var validator = require('validator'); // import validator module
const db = require("../conf/database"); // import database
const {flatten} = require("express/lib/utils");
const specialChars = ['\/', '\*', '\-', '\+', '\!', '\@', '\#', '\$', '\^', '\&', '\~', '\[', '\]'];
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

        //Check for special chars
        let hasSpecialChar = false;

        for(let i = 0; i < specialChars.length; i++) {
            if (password.includes(specialChars[i])) {
                hasSpecialChar = true;
                break;
            }
        }

        if (hasSpecialChar === false) {
            req.flash("error", `Password: must contain a special character: \n
            / * - + ! @ # $ ^ & ~ [ ]`);
        }

        if(req.session.flash.error) { // if true = error
            res.redirect('/registration');
        } else {
            next();
        }

    },
    emailCheck: function (req, res, next) {
        var {email} = req.body;

        if (!email) {
            req.flash("error", `Please enter an email address`);
        }

        //redundant because invalid chars are checked for later on, but gives user more info.
        if (email.includes(" ")) {
            req.flash("error", `Email: Must not Contain Spaces`)
        }

        //check if there is al least one . or @ in the email
        if (email.includes(".") && email.includes("@")) {
            //checks if user only put domain
            if (email.lastIndexOf("@") === 0) {
                req.flash("error", `Invalid Email Address`);
            }

            if (email.indexOf("@") !== email.lastIndexOf("@")) {
                req.flash("error", `Email: Invalid Email Name`);
            }

            let subLevelDomainSeparator = email.indexOf("@");
            let topLevelDomainSeparator = email.lastIndexOf(".");

            //checks domain name is viable, the last index of "." is because it can be in the name
            if (subLevelDomainSeparator > topLevelDomainSeparator) {
                req.flash("error", `Email: Invalid Email Address`);
            }
            if (topLevelDomainSeparator - subLevelDomainSeparator === 1) {
                req.flash("error", `Email: Invalid Subdomain`);
            }

            // //checks distance between "@" and "." for the domain
            // if (email.substring(subLevelDomainSeparator, topLevelDomainSeparator).length === 0) {
            //     req.flash("error" `Email: Invalid Domain`);
            // }

            //takes the "name/local" part of email address
            let localEmailName = email.substring(0, email.indexOf("@"));

            if (localEmailName.length > 63) {
                req.flash("error", `Email: Invalid Email Name Length`);
            }

            if (!/^[A-Za-z0-9._-]+$/.test(localEmailName)) {
                req.flash("error", `Email: Invalid Characters`)
            }

            //checks if the last character in the string is the top level domain separator (".")
            //This is because there should be at least one character after top level domain separator
            if (email.length - 1 === topLevelDomainSeparator) {
                req.flash("error", `Email: Invalid Top Level Domain`);
            }
        } else {
            req.flash("error", `Email: Must Contain a Valid Domain`);
        }

        if(req.session.flash.error) {
            res.redirect('/registration');
        } else {
            next();
        }
        //List of unusable email characters:
    },
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
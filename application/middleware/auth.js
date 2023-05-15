module.exports = {
    isLoggedIn: function (req, res, next) { //ensures user is logged in to access certain features
        //if there is a user object in a session object, they are logged in
        if (req.session.user) {
            next();
        } else {
            req.flash("error", `user must be logged in`);
            req.session.save(function (err) {
                if (err) {
                    next(err);
                }
                res.redirect('/login');

            });
        }
    },
    isMyProfile: function (req, res, next) { //ensures user can ONLY view their own profile
        // E.C.: private and public profiles
        var {id} = req.params;

        if (req.session.user.userID == id) { // == operator
            next(); // next('route') goes directly to route handler, anything else inside of next is considered an error
        } else {
            req.flash("error", `this is not your profile`);
            req.session.save(function (err) {
                if (err) {
                    next(err);
                } else {
                    res.redirect('/');
                }
            })
        }

    }
};
/*route that deals with comments*/
var express = require('express');
const {isLoggedIn} = require("../middleware/auth");
var router = express.Router();
var db = require('../conf/database')

router.post('/create', isLoggedIn, async function (req, res, next) { //creating comments
    var {userID, username} = req.session.user;
    var {postId, comment} = req.body;

    try {
        var [insertResult, _] = await db.execute(
            `INSERT INTO comments (text, fk_postId, fk_authorId) VALUE (?,?,?)`, [comment, postId, userID]
        );

        if (insertResult && insertResult.affectedRows == 1) {
            return res.status(201).json({
                CommentId: insertResult.insertId,
                username: username,
                comment: comment,
            });
        } else {//server sided comment submission failure
            res.json({message: "error"})
            //req.flash("error", `Comment: Submission Failed`);
        }

    } catch (error) {
        next(error);
    }


    // console.log(req.body);
    res.status(201).json(req.body); //resource created, return req.body

});



















module.exports = router;
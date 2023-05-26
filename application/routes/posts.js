/*deleting, searching, adding, editing posts is handled here*/
var express = require('express');
var router = express.Router();
var multer = require('multer');
const {makeThumbnail, getPostsById, getCommentsForPostById, postTosCheck, getRecentPosts} = require("../middleware/posts");
var db = require('../conf/database')
const {isLoggedIn, isMyProfile} = require("../middleware/auth");
const {isTosChecked} = require("../middleware/validation");

/*
* created directories:
* posts:
*   /public/images/uploads - stores thumbnails
*   /public/videos/uploads - stores user uploaded videos
*   /public/videos - stores video files, not by user
*   warning: using filesystem, NOT URLs
Todo: --All tasks completed--
* configure diskStorage object
* we only need destination and filename functions
*   order for when file is uploaded: filename -> destination
* all thumbnails and videos will be uploaded to the public directory
*   makes it easier for the front end
* for the filename function, get the file extension back
* note: for this project, only upload mp4s, they work on all browsers
* */

//cd = callback function
//cb is normally the name of an action you want to do, common among node APIs
//file's new name is passed into cb
//path to wherever file is moved also goes into cb
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // currentWorking directory (application)/public/videos/uploads DO NOT add the leading '/'
        // the leading slash IS necessary for the front end, will fix in handlebars
        cb(null, 'public/videos/uploads') // null = there is no error in file upload
    },
    filename: function (req, file, cb) { // file parameter is the reference to the uploaded file
        var fileExtension = file.mimetype.split("/")[1]; // mimetype denotes file type, this code gets right side after slash

        //prevents files sharing name to overwrite each other
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // unique tag for every upload
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`) // call back function to rename the file
    }
});

const upload = multer({ storage: storage })


//Lecture notes:
//upload.single = upload 1 item
//upload.array("uploadVideo, 20"), you can upload 20 videos at a time
router.post("/create", isLoggedIn, upload.single("uploadVideo"), makeThumbnail, async function (req, res, next) {
    var {title, description} = req.body;
    var {path, thumbnail} = req.file;
    var {userID} = req.session.user;

    try {
        // insert post information into db
        var [insertResult, _] = await db.execute(`INSERT INTO posts (title, description, video, thumbnail, fk_userid) VALUE (?,?,?,?,?);`, [title, description,path,thumbnail,userID]);

        if (insertResult && insertResult.affectedRows) {// check if post inserted
            req.flash("success", `Post: Created!`);

            return req.session.save(function (error) {
                if (error) next(error);
                return res.redirect(`/`);
            });

        } else {
            next(new Error('Post could not be created')); // failure caused by db, user does not need flash message
        }
    } catch (error) {
        next(error);
    }

});


router.get('/:id(\\d+)', getPostsById, getCommentsForPostById, function (req, res) { //set client ID later on.
    res.render('viewpost', {title: `View Posts ${req.params.id}`}); //, description: Video for your viewing pleasure
});

//search for posts
router.get('/search', async function (req, res, next) {

    var {searchValue} = req.query;

    try {
        // use search term to find results in db
        var [rows, _] = await db.execute(`select id,title,thumbnail, concat_ws(' ', title, description) as haystack
        from posts
        having haystack like ?;`, [`%${searchValue}%`]);

        if (rows && rows.length == 0) { // check if search found matches in db
            // return the most recent posts if no match
            var [rows, _] = await db.execute(`SELECT * FROM csc317.posts ORDER BY createdAt DESC LIMIT 8`);
            res.locals.posts = rows;
            res.render('index', { title: 'CSC 317 App / Home', name:"Pedro", description: 'Welcome to the home of Americas best lineups!'});
        } else {
            // show matching results
            res.locals.posts = rows;
            return res.render('index', { title: 'CSC 317 App / Home', name:"Pedro", description: 'Welcome to the home of Americas best lineups!'})
        }

    } catch (error) {
        next(error);
    }

});

//deletes a post
router.post("/delete/:id(\\d+)", async function (req, res, next) {
    let {userID} = req.session.user;
    let {id} = req.params;

    //checks if the user is trying to delete their own post or another person's
    var [rows, _] = await db.execute(`SELECT * FROM posts WHERE id=? AND fk_userid=?`, [id, userID]);

    if (rows && rows == 0) {
        req.flash('Error', "unable to delete post")
        res.redirect('/');
    } else {

        //deletes comments assigned to a post before deleting the post
        var [commentsRows, commentsFields] = await db.execute(`DELETE FROM comments WHERE fk_postId=?`, [id]);
        var [postsRows, postsFields] = await db.execute(`DELETE FROM posts WHERE id=?`, [id]);

        return res.redirect(`/users/profile/${userID}`);
    }


});



module.exports = router;
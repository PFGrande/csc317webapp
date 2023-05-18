/*deleting, searching, adding, editing posts is handled here*/
var express = require('express');
var router = express.Router();
var multer = require('multer');
const {makeThumbnail} = require("../middleware/posts");
var db = require('../conf/database')
const {isLoggedIn} = require("../middleware/auth");

//allows for video to be stored in local storage (hard drive)
/*
* created directories:
* posts:
*   /public/images/uploads - stores thumbnails
*   /public/videos/uploads - stores user uploaded videos
*   /public/videos - stores video files, not by user
*   warning: careful because now we are using filesystem, NOT URLs
*
*
Todo:
* configure diskStorage object
* we only need destination and filename functions
*   order for when file is uploaded: filename -> destination
* all thumbnails and videos will be uploaded to the public directory
*   makes it easier for the front end
* for the filename function, get the file extension back
* note: for this project, only upload mp4s, they work on all browsers
* */

//cb is normally the name of an action you want to do, common among node APIs
//what ever we want to name the file will be passed to cb
//path to wherever you want to move file will also go to cb
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //currentWorking directory (application)/public/videos/uploads DO NOT add the leading '/'
        // the leading slash IS necessary for the front end, will fix in handlebars
        cb(null, 'public/videos/uploads') //null = there is no error in file upload, multer catches most errors we might encounter
    },
    filename: function (req, file, cb) { // file parameter is the reference to the uploaded file
        var fileExtension = file.mimetype.split("/")[1]; //mimetype denotes file type, this code gets right side after slash

        //prevents files sharing name to overwrite each other
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //unique tag for every upload
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`) //call back function to rename the file
    }
});

const upload = multer({ storage: storage })



//upload.single = upload 1 item
//upload.array("uploadVideo, 20"), you can upload 20 videos at a time
router.post("/create", isLoggedIn, upload.single("uploadVideo"), makeThumbnail, async function (req, res, next) {
    // console.log(req.file); //video file
    // console.log(req.body); //text, ex: title, description
    // res.end();
    var {title, description} = req.body;
    var {path, thumbnail} = req.file;
    var {userID} = req.session.user;

    try {
        var [insertResult, _] = await db.execute(`INSERT INTO posts (title, description, video, thumbnail, fk_userid) VALUE (?,?,?,?,?);`, [title, description,path,thumbnail,userID]);

        if (insertResult && insertResult.affectedRows) {//check if post inserted
            req.flash("success", `Post: Created!`);

            return req.session.save(function (error) {
                if (error) next(error);
                return res.redirect(`/`);
                //return res.redirect(`/posts/${insertResult.insertId}`); //redirects to created post
            });

        } else {
            next(new Error('Post could not be created')); //failure caused by db, user does not need flash message
        }
    } catch (error) {
        next(error);
    }

});

// /viewpost/:id(\d+)
router.get('/:id(\\d+)', function (req, res) { //set client ID later on.
    res.render('viewpost', {title: 'View Posts', description: 'Video for your viewing pleasure'});
});

//search for posts
router.get('/search', function (req, res, next) {

});

//deletes a post
router.delete("/delete", function (req, res, next) {

});



module.exports = router;
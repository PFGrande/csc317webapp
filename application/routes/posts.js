/*deleting, searching, adding, editing posts is handled here*/
var express = require('express');
var router = express.Router();
var multer = require('multer');

//allows for video to be stored in local storage (hard drive)
/*
* created directories:
* posts:
*   /public/images/uploads - stores thumbnails
*   /public/videos/uploads - stores user uploaded videos
*   /public/videos - stores video files, not by user
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
        cb(null, '/tmp/my-uploads') //null = there is no error in file upload, multer catches most errors we might encounter
    },
    filename: function (req, file, cb) { // file parameter is the reference to the uploaded file
        var fileExtension = file.mimetype.split("/")[1]; //mimetype denotes file type, this code gets right side after slash

        //prevents files sharing name to overwrite each other
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //unique tag for every upload
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`) //call back function to rename the file
    }
});

const upload = multer({ storage: storage })



router.post("/create", function (req, res, next) {
    console.log(req);
    res.end();
})

















module.exports = router;
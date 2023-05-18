var pathToFFMPEG = require('ffmpeg-static');
var exec = require('child_process').exec;

module.exports = {
    makeThumbnail: function (req, res, next) {
        if (!req.file) {
            next(new Error("File upload failed"));
        } else {
            try {
                var destinationOfThumbnail = `public/images/uploads/thumbnail-${
                    req.file.filename.split(".")[0]
                }.png`;
                var thumbnailCommand = `${pathToFFMPEG} -ss 00:00:01 -i ${req.file.path} -y -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail}`;
                exec(thumbnailCommand);
                req.file.thumbnail = destinationOfThumbnail;
                next();
            } catch (error) {
                next(error);
            }
        }
    },
    getPostsForUserById: function (req, res, next) { //grab posts made by single user, viwable in profile page

    },
    getPostsById: function (req, res, next) { //gets single post to display on the "viewpost" page
        res.locals.currentPost = rows[0]; //gets 1 post
    },
    getCommentsForPostById: function (req, res, next) { //gets comments under a post
        res.locals.currentPost.comments = rows; //gets a row of comments
    }
    //after these middleware, render "viewpost", stopped @ 1:04:16
};
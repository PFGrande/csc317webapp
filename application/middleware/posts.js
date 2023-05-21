var pathToFFMPEG = require('ffmpeg-static');
var exec = require('child_process').exec;
var db = require('../conf/database');

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
    getPostsById: async function (req, res, next) { //gets single post to display on the "viewpost" page
        var {id} = req.params;
        try {
            let [rows, _] = await db.execute(`SELECT u.username, p.video, p.description, p.id
                FROM posts p
                JOIN users u
                ON p.fk_userid=u.id
                WHERE p.id=?`, [id]);

            const post = rows[0];
            if (!post) {
                req.flash("error", 'Post not found')
            } else {
                req.locals.currentPost = post;
                next();
            }

        } catch (error) {
            next(error);
        }
        // res.locals.currentPost = rows[0]; //gets 1 post
        // next();
    },
    getCommentsForPostById: async function (req, res, next) { //gets comments under a post
        res.locals.currentPost.comments = rows; //gets a row of comments

    },
    getRecentPosts: async function (req, res, next) {//shows content on the home page
        //SELECT * FROM csc317.posts ORDER BY createdBy DESC LIMIT 8
        try {
            var [rows, _] = await db.execute(`SELECT * FROM csc317.posts ORDER BY createdAt DESC LIMIT 8`);
            res.locals.posts = rows;
            res.render('index', { title: 'CSC 317 App / Home', name:"Pedro", description: 'Welcome to the home of Americas best lineups!'});

            next();
                // if (rows && rows.length == 0) {
                //     //return the most recent posts
                // } else {
                //     res.locals.posts = rows;
                //     return res.render('index')
                // }

        } catch (error) {
            next(error);
        }
    }
    //after these middleware, render "viewpost", stopped @ 1:04:16
};
var pathToFFMPEG = require('ffmpeg-static');
var exec = require('child_process').exec;
var db = require('../conf/database');
//paused @ 51:45
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
    //console.log(req.params)
    //console.log(rows[0] +"skgngjansgjendsjgds jgb sbk sdhnsbdf ergn ewrkg ndsklgn dsnj njkdsnjkdgfn jkdfgsnjdfgnjldnsfljnjdfsgnjlkds\n\n\n\n\n\n\n\n")
    //not working as intended, is it because comments haven't been implemented yet and it's returning null for the comments array?
    getPostsById: async function (req, res, next) { //gets single post to display on the "viewpost" page
        var {id} = req.params;
        try {
            let [rows, _] = await db.execute(
                `SELECT u.username, p.video, p.title, p.description, p.id, p.createdAt
                FROM posts p
                JOIN users u
                ON p.fk_userid=u.id
                WHERE p.id=?;`,
                [id]);

            const post = rows[0];
            //console.log(rows +"skgngjansgjendsjgds jgb sbk sdhnsbdf ergn ewrkg ndsklgn dsnj njkdsnjkdgfn jkdfgsnjdfgnjldnsfljnjdfsgnjlkds\n\n\n\n\n\n\n\n")

            if (!post) { //redirect if post not found
                req.flash("error", 'Post not found');
                res.redirect('/');
            } else {
                res.locals.currentPost = rows[0];
                next();
            }

        } catch (error) {
            next(error);
        }
    },
    getProfilePostsById: async function (req, res, next) { //gets multiple post to display on the "profile" page
        var {id} = req.params;
        try {
            let [rows, _] = await db.execute(
                `SELECT * FROM posts WHERE fk_userid = ?;`, [id]);

            const posts = rows;
            //console.log(rows +"skgngjansgjendsjgds jgb sbk sdhnsbdf ergn ewrkg ndsklgn dsnj njkdsnjkdgfn jkdfgsnjdfgnjldnsfljnjdfsgnjlkds\n\n\n\n\n\n\n\n")

            if (!posts) { //redirect if post not found
                req.flash("error", 'Post not found');
                res.redirect('/');
            } else {
                res.locals.currentPosts = rows;
                next();
            }

        } catch (error) {
            next(error);
        }
    },
    getCommentsForPostById: async function (req, res, next) { //gets comments under a post
        var {id} = req.params;
        try {
            let [rows, _] = await db.execute(
                `SELECT u.username, c.text, c.createdAt
                FROM comments c
                JOIN users u
                ON c.fk_authorId=u.id
                WHERE c.fk_postId=?;`,
                [id]);
            res.locals.currentPost.comments = rows;
            next();
        } catch (error) {
            next(error);
        }

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
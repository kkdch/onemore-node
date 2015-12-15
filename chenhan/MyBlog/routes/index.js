// var express = require('express');
// var router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
// module.exports = router;
var crypto = require('crypto');
var flash = require('connect-flash');
var session = require('express-session');
var markdown = require('markdown').markdown;
// var User = require('../models/user.js');
require('../models/UserModel');
require('../models/PostModel');
require('../models/CommentModel');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

var dateFormat = require('dateformat');

module.exports = function(app) {
  var checkLogin = function(req, res, next) {
    if (!req.session.user) {
      req.flash('error', 'Please log in');
      res.redirect('/');
    }
    next();
  }

  var checkNotLogin = function(req, res, next) {
    if (req.session.user) {
      req.flash('error', 'You already logged in');
      res.redirect('back');
    }
    next();
  }

  var indexGet = function(req, res) {
    Post.find().sort({_id: -1}).exec(null, function(err, posts) {
      if (err) {
        req.flash('error', err);
      }
      res.render('index', {
        title: 'MyBlog',
        user: req.session.user,
        posts: posts,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  };

  var regGet = function(req, res) {
    res.render('reg', {
      title: 'Register',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  };

  var regPost = function(req, res) {
    var name = req.body.name;
    var password = req.body.password;
    var password_re = req.body['password-repeat'];
    //check comfirmed password
    if (password_re != password) {
      req.flash('error', 'Please re-comfirm your password!');
      return res.redirect('/reg');
    }
    //generate md5 of password
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
      name: name,
      password: password,
      email: req.body.email
    });
    //check if user exists
    User.findOne({name:newUser.name}, function(err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      if (user) {
        req.flash('error', 'User already exists');
        return res.redirect('/reg');
      }
      //add new user
      newUser.save(function(err, user) {
        if (err) {
          req.flash('error', 'Unknown error');
          return res.redirect('/reg');
        }
        req.session.user = user;
        req.flash('success', 'Register complete');
        res.redirect('/');
      });
    });
  };

  var loginGet = function(req, res) {
    res.render('login', {
      title: 'Login',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  };

  var loginPost = function(req, res) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    User.findOne({name: req.body.name}, function(err, user) {
      if (!user) {
        req.flash('error', 'User doesn\'t exists');
        return res.redirect('/');
      }
      if (user.password != password) {
        req.flash('error', 'Wrong password');
        return res.redirect('/');
      }
      req.session.user = user;
      req.flash('success', 'Login successful');
      res.redirect('/');
    });
  };

  var postGet = function(req, res) {
    res.render('post', {
      title: 'Post',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  };

  var postPost = function(req, res) {
    var currentUser = req.session.user;
    var content = markdown.toHTML(req.body.post);
    var currentTime = dateFormat(Date.now(), 'yyyy-mm-dd h:MM:ss');
    var newPost = new Post({
      name: currentUser.name,
      title: req.body.title,
      content: req.body.post,
      markedContent: content,
      createTime: currentTime,
      updateTime: currentTime
    });
    newPost.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.direct('/');
      }
      req.flash('success', 'Post successful');
      res.redirect('/');
    });
  };

  var logoutGet = function(req, res) {
    req.session.user = null;
    req.flash('success', 'Logout successful');
    res.redirect('/');
  };

  var blogGet = function(req, res) {
    Post.findOne({_id: req.params._id}, function(err, post) {
      if (!post) {
        req.flash('error', err.toString());
        return res.redirect('back');
      }
      res.render('article', {
        title: post.title,
        user: req.session.user,
        post: post,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  };

  var userGet = function(req, res) {
    User.findOne({name: req.params.name}, function(err, user) {
      if (!user) {
        req.flash('error', 'User doesn\'t exsit');
        return res.redirect('/');
      }
      Post.find({name: user.name}).sort({_id: -1}).exec(null, function(err, posts) {
        if (err) {
          req.flash('error', err);
          return res.redirect('back');
        }
        res.render('user', {
          title: user.name,
          user: req.session.user,
          posts: posts,
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
        });
      });
    });
  };

  var editGet = function(req, res) {
    var currentUser = req.session.user;
    Post.findOne({_id: req.params._id}, function(err, post) {
      if (err) {
        req.flash('error', err);
        return res.redirect('back');
      }
      if (currentUser.name != post.name) {
        req.flash('error', 'You can\'t edit others\' posts!');
        return res.redirect('back');
      }
      // post.content = markdown.parse(post.content);
      res.render('edit', {
        title: 'Edit',
        post: post,
        user: currentUser,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  };

  var editPost = function(req, res) {
    var currentUser = req.session.user;
    var content = markdown.toHTML(req.body.post);
    var currentTime = dateFormat(Date.now(), 'yyyy-mm-dd h:MM:ss');
    var update = {
      title: req.body.title,
      content: req.body.post,
      markedContent: content,
      updateTime: currentTime
    };
    Post.findByIdAndUpdate(req.params._id, update, function(err, post) {
      if (err) {
        req.flash('error', err.toString());
        return res.redirect('back');
      }
      if (currentUser.name != post.name) {
        req.flash('error', 'You can\'t edit others\' post!');
        return res.redirect('back');
      }
      res.redirect('/blog/' + req.params._id.toString());
    });
  };

  var removeGet = function(req, res) {
    var currentUser = req.session.user;
    Post.findOne({_id: req.params._id}, function(err, blog) {
      if (err) {
        req.flash('error', err.toString());
        return res.redirect('back');
      }
      if (blog.name != currentUser.name) {
        req.flash('error', 'You can\'t delete others\ post!');
        return res.redirect('back');
      }
      blog.remove();
      res.redirect('/');
    });
  };

  var commentPost = function(req, res) {
    var currentUser = req.session.user;
    var currentTime = dateFormat(Date.now(), 'yyyy-mm-dd h:MM:ss');
    if (!currentUser) {
      req.flash('error', 'Log in to comment');
      return res.redirect('/blog/' + req.params._id);
    }
    var comment = new Comment({
      user: currentUser.name,
      content: req.body.content,
      time: currentTime
    });
    Post.findOne({_id: req.params._id}, function(err, blog) {
      if (err) {
        req.flash('error', err.toString());
        return res.redirect('back');
      }
      blog.comments.push(comment);
      blog.save();
      res.redirect('back');
    });
  };

  app.get('/', indexGet);
  app.post('/', loginPost);

  app.get('/reg', checkNotLogin);
  app.get('/reg', regGet);

  app.post('/reg', checkNotLogin);
  app.post('/reg', regPost);

  app.get('/post', checkLogin);
  app.get('/post', postGet);

  app.post('/post', checkLogin);
  app.post('/post', postPost);

  app.get('/logout', checkLogin);
  app.get('/logout', logoutGet);

  app.get('/user/:name', userGet);
  app.get('/blog/:_id', blogGet);
  app.post('/blog/:_id', commentPost);

  app.get('/edit/:_id', editGet);
  app.post('/edit/:_id', editPost);

  app.get('/remove/:_id', removeGet);
};

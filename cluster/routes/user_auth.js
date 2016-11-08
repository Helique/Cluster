var express = require('express');
var router = express.Router();

var user_model = require("../models/user");

var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  user_model.findById(id, function(user) {
    done(null, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    user_model.findByUsername(username, function (user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.passhash, function(err, res) {
        if (!err && res) {
          return done(null, user);
        }
        done(null, false, { message: 'Incorrect password.' });
      });
    });
  }
));

function mustBeLoggedIn(req, res, next) {
  if (!req.user) {
    res.status(401);
    return res.end("Unauthorized");
  }
  next();
}

router.get('/name', mustBeLoggedIn, function(req, res) {
  console.log(req.user);
  res.end(req.user.name);
});

router.post('/auth', passport.authenticate('local'), function(req, res) {
  res.end("you made it");
});

router.post('/create', function(req, res, next) {
  user_model.newUser(req.body.username, req.body.password, req.body.email, function(user) {
    req.logIn(user, function(err) {
      if (err) return next(err);
      res.redirect("/");
    });
  });
});

module.exports = router;

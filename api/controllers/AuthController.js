var passport = require("passport");

var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var SECRET = 'shhhhhhared-secret'; 
var crypto = require('crypto');
var app = require('sails').express.app;
app.use(expressJwt({secret: SECRET}));

module.exports = {
  login: function(req,res){
	if(!req.isAuthenticated()){
		res.view("auth/login");
	}else{
		res.redirect('/');
	}
  },

  process: function(req,res, next){
	passport.authenticate('local', function(err, user, info){
		//console.log(user);
	  if ((err) || (!user)) {
		return res.redirect('/login');
	  }
	  req.logIn(user, function(err){
		//console.log(err);
		if (err){
			console.log('not correct')
			//return res.redirect('/login');
			return next(err);
		}
		return res.redirect('/');
	  });
	})(req, res, next);
  },


	logout: function (req,res){
		req.logout();
		res.redirect('/');
	},
_config: {}
};
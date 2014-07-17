var passport    = require('passport'),
  	LocalStrategy = require('passport-local').Strategy,
  	//bcrypt = require('bcrypt-nodejs'),
	util = require('util');

var crypto = require('crypto');

passport.use(new LocalStrategy(
  function(username, password, done) {
  	console.log('use Local Strategy...')
	User.findOne({username: username}).done(function(err, user) {
	  if (err) { return done(null, err); }
	  if (!user || user.length < 1) { return done(null, false, { message: 'Incorrect User'}); }
		if(user.password !== password){
			return done(null, false);
		}else{
			return done(null, user);
		}
	});
  })
);

module.exports = {
	express: {
		customMiddleware: function(app){
		  	console.log('express midleware for passport');
		  	app.use(passport.initialize());
		  	app.use(passport.session());

			passport.serializeUser(function(user, done) {
				console.log('serialize user: ', user);
			  	done(null, user.id);
			});

			passport.deserializeUser(function(id, done) {
				  User.findById(id, function (err, user) {
				  	console.log('deserializeUser...');
						done(err, user);
				  });
			});
		}
	}
};
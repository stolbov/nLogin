var expressJwt = require('express-jwt'),
	jwt = require('jsonwebtoken'),
	crypto = require('crypto');

var SECRET = 'shhhhhhared-secret',
	TOKEN = false,
	USER; 

var readToken = function(user, done){
	Tokens.findOne({userId: user.id}).done(function(err, token){
		if(err){
			console.log('error toker');
			return done();
		}
		if(!token){
			console.log('add token...');
			TOKEN = createToken();
			Tokens.create({token: TOKEN, userId: user.id}).done(function(err, token){
				verifyToken(token, done);
			});
		}else{
			console.log('Find token: ', token.token);
			verifyToken(token, done);
		}
	});
}

var verifyToken = function(token, done){
	jwt.verify(token.token, SECRET, function(err, decoded){
		console.log('Verified errors: ', err);
		console.log('Verified token: ', decoded);
		if(decoded == undefined){
			console.log('update token...');
			if(token.id){
				Tokens.update(
					{id: token.id},
					{token: createToken()},
					function(err, token){
						if(err){
							console.log('update token error!');
						}else{
							console.log('new token:', token);
							return done();
						}
					}
				);
			}else{
				console.log('update token error 2!')
			}
		}else{
			console.log('Token exp: ', new Date(decoded.exp*1000));
			return done();
		}
	});
}

var createToken = function(){
	return jwt.sign(USER, SECRET, { expiresInMinutes: 3 });
}

module.exports = function(req, res, next){
  if (req.isAuthenticated()){
  	console.log("Authorized");
  	console.log('user: ', req.user);
  	USER = req.user[0];
  	readToken(USER, next);
    //return next();
  }else{
  	console.log("Not Authorized");
    //return res.send(403, { message: 'Not Authorized' });
    return res.redirect('/login');
  }
}
var passport = require("passport");

module.exports = {
  index: function(req,res){
		console.log('--------------------');
    	res.view('home/index', {user: req.user[0]});
  },

  _config: {}
};
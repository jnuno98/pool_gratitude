let Tokens = require('../public/javascripts/tokens');
var express = require('express');
var router = express.Router();

router.post('/balance', async function(req, res, next) {
	tok = new Tokens();

	try {
		var balance = await tok.balanceOf(req.body.user,req.body.ticker);
    	res.send(balance);
	} catch(err) {res.send("error");}

});

module.exports = router;


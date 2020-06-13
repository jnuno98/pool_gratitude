let Staking = require('../public/javascripts/staking');
var express = require('express');
var router = express.Router();

router.post('/withdraw', async function(req, res, next) {
	stk = new Staking();

	try {
		await stk.withdraw(req.body.pool,req.body.ticker,req.body.user);
		res.send("you have withdrawn");
	}
	catch(err) {
		res.send(false);}

});



module.exports = router;


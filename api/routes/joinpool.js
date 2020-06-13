let Staking = require('../public/javascripts/staking');
var express = require('express');
var router = express.Router();

stk = new Staking();
router.post('/joinpool', async function(req, res, next) {

	try {
		await stk.join_pool(req.body.pool,req.body.ticker,req.body.user,req.body.amount);
		res.send("you have joined");
	} catch(err) {res.send(false);}

});

router.post('/getapprove', async function(req, res, next) {

	try {
		var i = stk.get_approval(req.body.ticker,req.body.amount,req.body.user);
		res.send(i);

	} catch(err) {res.send(false);}

});

module.exports = router;


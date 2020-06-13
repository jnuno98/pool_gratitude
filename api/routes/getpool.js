let Staking = require('../public/javascripts/staking');
var express = require('express');
var router = express.Router();

router.post('/getpool', async function(req, res, next) {
	stk = new Staking();

	try {
		var pool = await stk.get_pool(req.body.pool,req.body.ticker,req.body.user);
    	res.send(pool);
	} catch(err) {res.send("error_getpool");}

});

router.post('/getpoolseats', async function(req, res, next) {
	stk = new Staking();

	try {
		var seats = await stk.get_seats(req.body.pool,req.body.ticker,req.body.user);
    	res.send(seats);
	} catch(err) {res.send("error_getseats");}

});


module.exports = router;


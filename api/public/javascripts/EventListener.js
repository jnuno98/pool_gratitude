
let Staking = require('./staking');
let Database = require('./database');

  
class Listener {


	static listen () {
		let stk = new Staking();
		let contract = stk.get_contract();
		contract.instance.events.Pool({}, function(error, result) {			
		
		if (error) return
			let pool_address = result.returnValues.pool;
			let token_address = result.returnValues.token;
			let description = result.returnValues.description;

			Database.insert_pools(pool_address,token_address,description);

	    	console.log("Pool: "+pool_address+ " "+ token_address + " " + description);
		});

		contract.instance.events.Join({}, function(error, result) {			
		
		if (error) return
			let pool_address = result.returnValues._pool;
			let token_address = result.returnValues._token;
			let user = result.returnValues.user;
			let amount = result.returnValues.amount;

	    	console.log("Join: "+pool_address+ " "+ token_address + " " + amount + " " + user);
		});

		contract.instance.events.Withdraw({}, function(error, result) {			
		
		if (error) return
			let pool_address = result.returnValues._pool;
			let token_address = result.returnValues._token;
			let user = result.returnValues._user;
			let donation = result.returnValues.donation;			
			let staked = result.returnValues.staked;

	    	console.log("Withdraw: "+pool_address+ " "+ token_address + " " + user + " " + donation + " " + staked);
		});



	}
}

module.exports = Listener;


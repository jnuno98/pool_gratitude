

const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();

const uri = "mongodb+srv://"+process.env.REACT_APP_USER+ ":" + process.env.REACT_APP_PASS +"@pool-cuxcr.mongodb.net/Pool?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

class Database {




	/*
	-----------------------------------------------------------------------
									inserts
	-----------------------------------------------------------------------
																			*/

	static insert_pools(pool,token,description) {
		var myobj = { pool: pool, token: token, description: description };


		client.connect(err => {
  			const collection = client.db("Pool").collection("Pools").insertOne(myobj, 

  			function(err, res) {
    
    			if (err) throw err;
    			console.log("1 document inserted");
  			
  			client.close();
			});
		});
	}

	//confirm if user already exists
	static insert_user(user) {
		var myobj = {user: user, pools: []};

		client.connect(err => {
  			const collection = client.db("Pool").collection("Users").insertOne(myobj, 

  			function(err, res) {
    
    			if (err) throw err;
    			console.log("1 document inserted");
  			
  			client.close();
			});
		});

	}

	//confirm if user exists
	static insert_user_pool(user,pool,token,investment) {
		var myobj = {pool: pool, token: token, investment: investment, donation: 0, active: true};

		client.connect(err => {
  			const collection = client.db("Pool").collection("Users")
  								.update({user: user }, { $push: { pools: myobj } }, 

  			function(err, res) {
    
    			if (err) throw err;
    			console.log("1 document inserted");
  			
  			client.close();
			});
		});

	}





	/*
	-----------------------------------------------------------------------
									getters
	-----------------------------------------------------------------------
																			*/


	//get every pool from user
	static get_user_pools(user) {

		client.connect(err => {
			const collection = client.db("Pool").collection("Users")
									.findOne({user: user}

			function(err, res) {
    
    				if (err) throw err;
    				return res;
    				console.log("1 document getted");
  			
  			client.close();
			});
		});
		
	}


	//get every active pool from user
	//get a pool description by pool, token
	// get a pool, token address by description (every one)




	/*
	-----------------------------------------------------------------------
									changes
	-----------------------------------------------------------------------
																			*/


	// change from active no inactive
	// change donation

	static change_pool_status(pool,token,donation) {
		var myobj = {pool: pool, token: token, investment: investment, donation: 0, active: true};

		client.connect(err => {
  			const collection = client.db("Pool").collection("Pools")
  								.update({pool: pool,token: token }, { $set: { active: false, donation: donation } }, 

  			function(err, res) {
    
    			if (err) throw err;
    			console.log("1 document inserted");
  			
  			client.close();
			});
		});
	}

	

}

module.exports = Database;
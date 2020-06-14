

Web3 = require("web3");

const SignedTransaction = require('./transaction');
const Tokens = require('./tokens');


var price ;

var networks;


var contract;


class Staking {
  	
    constructor() {

      const providerMainnet = new Web3.providers.WebsocketProvider(
        "wss://mainnet.infura.io/ws/v3/23431f59720a43e7b7b7878f3b1446a9"
      );

      const providerRopsten = new Web3.providers.WebsocketProvider(
        "wss://ropsten.infura.io/ws/v3/23431f59720a43e7b7b7878f3b1446a9"
      );


      const mainnet = new Web3(providerMainnet);
      const ropsten = new Web3(providerRopsten);


      networks = {ropsten: ropsten, mainnet: mainnet}

    
      this.load_contract();

      price = networks.ropsten.utils.toWei("0.0000001","ether").toString();

      
    }

    async load_contract () {
      const contract_address = "0xa2095F51458DB47c194E408500f76117109d3d2b";
      const grat_contract = new networks.ropsten.eth.Contract([ { "constant": false, "inputs": [ { "name": "_pool", "type": "address" }, { "name": "_token", "type": "address" }, { "name": "_user", "type": "address" }, { "name": "_amount", "type": "uint256" } ], "name": "join_pool", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_pool", "type": "address" }, { "name": "_token", "type": "address" }, { "name": "begin", "type": "uint256" }, { "name": "end", "type": "uint256" }, { "name": "min", "type": "uint256" }, { "name": "interest", "type": "uint16" }, { "name": "_description", "type": "string" } ], "name": "setPool", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_pool", "type": "address" }, { "name": "_token", "type": "address" }, { "name": "_user", "type": "address" } ], "name": "withdraw", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "_token", "type": "address" }, { "indexed": false, "name": "_pool", "type": "address" }, { "indexed": false, "name": "_user", "type": "address" }, { "indexed": false, "name": "donation", "type": "uint256" }, { "indexed": false, "name": "staked", "type": "uint256" } ], "name": "Withdraw", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "token", "type": "address" }, { "indexed": false, "name": "pool", "type": "address" }, { "indexed": false, "name": "description", "type": "string" } ], "name": "Pool", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "_token", "type": "address" }, { "indexed": false, "name": "_pool", "type": "address" }, { "indexed": false, "name": "user", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "Join", "type": "event" }, { "constant": true, "inputs": [ { "name": "_token", "type": "address" }, { "name": "_pool", "type": "address" } ], "name": "get_pool", "outputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint16" }, { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_token", "type": "address" }, { "name": "_pool", "type": "address" } ], "name": "get_pool_seats", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_pool", "type": "address" }, { "name": "_token", "type": "address" }, { "name": "_user", "type": "address" } ], "name": "get_user_staking", "outputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" } ], "name": "pools", "outputs": [ { "name": "begin_date", "type": "uint256" }, { "name": "end_date", "type": "uint256" }, { "name": "interest", "type": "uint16" }, { "name": "description", "type": "string" }, { "name": "min_amount", "type": "uint256" }, { "name": "seats", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "address" } ], "name": "user_staking", "outputs": [ { "name": "start_date", "type": "uint256" }, { "name": "amount", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]
          ,contract_address);


      contract = {address: contract_address, instance: grat_contract};
    }


    get_contract() {
      return contract;
    }



    get_approval(ticker,amount,user) {
        let tok = new Tokens();
        let token = tok.get_token(ticker)[0];

        return tok.approve(contract.address,amount,ticker,user);
    }


    async get_pool(_pool,ticker,userAddress) {
            let tok = new Tokens();
            let token = tok.get_token(ticker)[0].address;

            var i = await contract.instance.methods.get_pool(token,_pool).call({from: userAddress, gas: 50000, gasPrice: price});
            var _seats = await this.get_seats(_pool,ticker,userAddress);

            return {description: i[4], interest: i[3], minimum: i[2], 
                    starts: i[0], ends: i[1], seats : _seats};
    }

    async get_seats(_pool,ticker,userAddress) {
        let tok = new Tokens();
        let token = tok.get_token(ticker)[0].address;
        return await contract.instance.methods.get_pool_seats(token,_pool).call({from: userAddress, gas:100000});
        
    }



    //returns an array {user,amount,timestamp}
    async get_user_staking(_pool,ticker,_user) {

      let tok = new Tokens();
      let token = tok.get_token(ticker)[0].address;

      var i = await contract.instance.methods.get_user_staking(_pool,token,_user).call({from: _user, gas:500000});
      return i;
    }



    async join_pool(_pool,ticker,user,_amount) {

            let tok = new Tokens();
            let sgtr = new SignedTransaction();

            let token = tok.get_token(ticker)[0];
            
            let tx_builder = contract.instance.methods.join_pool(_pool,token.address,user,_amount);

            await sgtr.transaction(tx_builder,contract.address,token.network);

       

    }

    async withdraw(_pool,ticker,_user) {
            
                let tok = new Tokens();
                const sgtr = new SignedTransaction();
                let token = tok.get_token(ticker)[0];


                  var i = await this.get_user_staking(_pool,ticker,_user);
                  const amount = i[1];



                  await tok.approve_owner(contract.address,amount,ticker);

                  var tx_builder = contract.instance.methods.withdraw(_pool,token.address,_user);

                  await sgtr.transaction(tx_builder,contract.address,token.network);
                
              
   
    }




  	




}

module.exports = Staking;





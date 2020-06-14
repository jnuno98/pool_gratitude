

Web3 = require("web3");




const SignedTransaction = require('./transaction');

var tokens, networks;

var price;


const erc_abi = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "sender", "type": "address" }, { "name": "recipient", "type": "address" }, { "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "INITIAL_SUPPLY", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "spender", "type": "address" }, { "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "account", "type": "address" }, { "name": "amount", "type": "uint256" } ], "name": "mint", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "account", "type": "address" } ], "name": "addMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceMinter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "spender", "type": "address" }, { "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "recipient", "type": "address" }, { "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "account", "type": "address" } ], "name": "isMinter", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "owner", "type": "address" }, { "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "account", "type": "address" } ], "name": "MinterAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "account", "type": "address" } ], "name": "MinterRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" } ];



class Tokens {


    constructor() {

      const providerMainnet = new Web3.providers.WebsocketProvider(
        "wss://mainnet.infura.io/ws/v3/23431f59720a43e7b7b7878f3b1446a9"
      );

      const providerRopsten = new Web3.providers.WebsocketProvider(
        "wss://ropsten.infura.io/ws/v3/23431f59720a43e7b7b7878f3b1446a9"
      );


      const mainnet = new Web3(providerMainnet);
      const ropsten = new Web3(providerRopsten);

      tokens = [
                {ticker: "BEAR", address: "0x0450df0812bbd9e4d5d3c18f97f1969d633498c0",contract: undefined, network: ropsten},
                {ticker: "GRATITUDE", address: "0xa5c9C652E9bC07352feEaFec5d4503aB7C253C0f", contract : undefined, network: ropsten}
                ];

      networks = {ropsten: ropsten, mainnet: mainnet}

    
  		this.load_contracts();

      price = networks.ropsten.utils.toWei("0.0000001","ether").toString();

      
  	}

    async load_contracts () {
      var net = this.get_token("BEAR")[0].network

      const bear_contract =  new net.eth.Contract(erc_abi,this.get_token("BEAR")[0].address);
      tokens[0].contract = bear_contract;

      net = this.get_token("GRATITUDE")[0].network
      const gratitude_contract = new net.eth.Contract(erc_abi,this.get_token("GRATITUDE")[0].address);
      tokens[1].contract = gratitude_contract;
    }

    /*-----find token address by ticker*/
    get_token(ticker) {
      return tokens.filter(item => {
        return item.ticker === ticker;
      })
    };



    approve (spender,amount,ticker,user) {
      const token = this.get_token(ticker)[0];

      var tx_builder = token.contract.methods.approve(spender,amount);
      return {from: user,to: token.address ,data: tx_builder.encodeABI(),gas: 3000000, gasPrice: price};
    }

    async approve_owner(spender,amount,ticker) {
        let token = this.get_token(ticker)[0];

        const sgtr = new SignedTransaction();
        var tx_builder = token.contract.methods.approve(spender,amount);
        await sgtr.transaction(tx_builder,this.get_token(ticker)[0].address,token.network);



    }

    async balanceOf(_user,ticker) {
      return await this.get_token(ticker)[0].contract.methods.balanceOf(_user).call({from: _user, gas:100000});
    }



}
module.exports = Tokens;

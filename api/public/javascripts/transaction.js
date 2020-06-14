

var price; 

const owner = "0xae6fb7e6c99abc54f224bfa9c2e0139123604cec";

var networks;

class SignedTransaction {

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

        price = networks.ropsten.utils.toWei("0.0000001","ether").toString(); 
    }


	async transaction(tx_builder,_to,network) {
        


            require('dotenv').config();

            var privateKey = process.env.REACT_APP_SECRET_INFO;
            var txCount = await network.eth.getTransactionCount(owner);


            var encoded_tx = tx_builder.encodeABI();

            var tx = {
                    nonce: txCount,
                    gas: network.utils.toHex(800000),
                    gasPrice: network.utils.toHex(price),
                    data: encoded_tx,
                    from: owner,
                    to: _to
            };

            var Transaction = require('ethereumjs-tx').Transaction;

            var trs = new Transaction(tx, { chain: 'ropsten'})

            trs.sign(Buffer.from(privateKey, "hex"));

            var serializedTx = trs.serialize();
            var raw = '0x' + serializedTx.toString('hex');  

            
            var receipt = await network.eth.sendSignedTransaction(raw);

        

 	} 
}

module.exports = SignedTransaction;

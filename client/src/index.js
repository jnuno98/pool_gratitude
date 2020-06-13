import React from 'react'
import ReactDOM from 'react-dom'
import './main.css';
import axios from 'axios';
import {Web3} from 'web3';
import Countdown from 'react-countdown-now';
import Confetti from 'react-confetti'





    Web3 = require("web3");
    var web3 =window.web3;
    if (typeof web3 !== 'undefined') {
        console.log('Web3 found');
        web3 = new Web3(web3.currentProvider);
        web3.eth.defaultAccount = web3.eth.accounts[0];
    } else {
        console.error('web3 was undefined');
    }



    var price = web3.utils.toWei("0.000000000001","ether").toString();




    var userAddress;














class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: null,
            loaded: false
        }
    }



    async componentDidMount() {
        await this.getAccountName();

        this.setState((state,props) => {
            return {loaded: true};
        });

    }



    async getAccountName() {
        // eslint-disable-next-line no-undef
        this.setState({account: await ethereum.enable()}, () => {
            userAddress = this.state.account[0];
        });
    }


    create () {
        var poolAddress = "0xfbe3d2a6818f19CFe42Bf14435A1ba1caeF764cA";


        ReactDOM.render(<Pool pool= {poolAddress} ticker={"BEAR"}/>, document.querySelector('#root'));
    }


    render() {
        return <div className = "pool">
                    <div className="header" id = "topBar">
                        <img className="topleft" src="http://13.57.47.139/adventure-logo.png" style={{width: '169px', height: '50px'}}></img>
                        <div className="topleftmiddle">pool of bearitude</div>

                    </div>
                    <div className="loader" style={{ display: (this.state.loaded ? 'none' : 'block') }}></div>
                    <div className="header"><h1>pool of bearitude</h1></div>
                    <div className="metamask-container">
                        <button className="metamask" disabled={!this.state.loaded} onClick={this.create}><span>connect to metamask</span></button>
                    </div>
                </div>
    }

}



ReactDOM.render(<App />, document.querySelector('#root'));




























class Pool extends React.Component {
    constructor(props,) {
        super(props);
        this.state = {
            account: userAddress,
            pool: this.props.pool,
            ticker: this.props.ticker,
            pool_components: undefined,
            balance: undefined,
            seats: 0,
            loader: false,
            countdown: 0,
            done: false
            
        };
    }



    async componentDidMount() {

        console.log(web3.eth.accounts.create().address);

        //this.sendToken(userAddress,"BEAR",1);

        this.update_balance(userAddress,"BEAR");

        await this.get_pool(this.state.pool, "BEAR");

        this.setState((state,props) => {
            return {loader: true};
        });

    }











    /*
        get pool from its address and token - pools are created in a separate program
    */

    async get_pool(_pool,ticker) {
        var format = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'});

        const params = {
                    pool: _pool, 
                    ticker: ticker,
                    user: userAddress
                    };

        const url ="getpool";

        try {
            var pool = await this.api_request(url,params);
            
            this.setState((state, props) => {
                var end_date = format.format(pool.ends * 1000)
                var begin_date = format.format(pool.starts * 1000)
                return {
                    pool_components: "description: "+pool.description+" | interest: "+pool.interest
                        +" | minimum: "+pool.minimum+" | starts: "+begin_date+" | ends: "+end_date,
                    seats: pool.seats, 
                    countdown: pool.ends
                    };
            });
        }
        catch(err) {
            console.log(err+"can't get pool");
        }
            
              
    }













    async join_pool(_pool,ticker) {
        this.setState((state,props) => {
            return {loader: false};
        });
        
        try{
            var _amount = prompt("Enter the amount you want to stake: ");
            _amount = web3.utils.toWei(_amount,"ether");
            console.log(_amount);
            const par = {
                    ticker: ticker,
                    amount: _amount,
                    user: userAddress
            };

            var tx_builder = await this.api_request("getapprove",par);
            if (!tx_builder) throw "can't join approve";

            await web3.eth.sendTransaction(tx_builder);
            




            const params = {
                    pool: _pool, 
                    ticker: ticker,
                    user: userAddress,
                    amount: _amount
                    };

            const url ="joinpool";

            var i = await this.api_request(url,params);
            if (!i) throw "can't join";

            this.update_balance(userAddress,ticker);
            this.update_seats(this.state.pool,ticker);


        } catch(err) {
            window.alert("you can't join the pool");
        }

        this.setState((state,props) => {
            return {loader: true};
        });
    }



    async withdraw(_pool,ticker) {
        this.setState((state,props) => {
            return {loader: false};
        });

        const params = {
            pool: _pool, 
            ticker: ticker,
            user: userAddress
        };

        const url ="withdraw";

        try {
            var i = await this.api_request(url,params);
            if (!i) throw "can't withdraw";

            this.update_balance(userAddress,ticker);
            
            this.setState((state,props) => {
            return {done: true};
            });
        
        }
        catch(err) {
            window.alert("cant withdraw yet");
        }
        this.setState((state,props) => {
            return {loader: true};
            });
        
    }



    async api_request(url_end, params) {
        var url = 'http://localhost:9000/'+url_end;
        var res;
        await axios.post(url,params)
                .then(function (response) {
                    res = response.data;
                })
                .catch(function (error) {
                });
        
        return res;
    }



    /*
        Updates the balance in the state from the balance in the contract
    */

    async update_balance(_user,ticker) {
        const params = {
                    user: _user, 
                    ticker: ticker
                    };

        const url ="balance";

        try {
            var balance = (await this.api_request(url,params)).toString();
            balance = web3.utils.fromWei(balance,"ether");
            
            this.setState((state,props) => {
                return {balance: balance};
            });
        }
        catch(err) {
            console.log(err+"can't get balance");
        }


    }


    async update_seats(_pool,ticker) {
        const params = {
                    pool: _pool, 
                    ticker: ticker,
                    user: userAddress
                    };

        const url ="getpoolseats";

        try {
            var seats = await this.api_request(url,params);
            
             this.setState((state,props) => {
                return {seats: seats};
            });
        
        }
        catch(err) {
            console.log(err+"can't get seats");
        }
       
    }


        render() {
        return <div className = "pool" >
                <div className="header" id = "topBar">
                    <img className="topleft" src="http://13.57.47.139/adventure-logo.png" style={{width: '169px', height: '50px'}}></img>
                    <div className="topleftmiddle">pool of bearitude</div>
                </div>
                <div className="loader" style={{ display: (this.state.loader ? 'none' : 'block') }}></div>
                <div className="header"> <h4>balance: {this.state.balance}</h4></div>
                <div className="header"><h1>pool</h1></div>
                <div className="description">
                    <h3>{this.state.pool_components}</h3>
                    <h3>seats: {this.state.seats}</h3>
                </div>
                <div className="count">
                    <Countdown date={this.state.countdown*1000}
                                onComplete={() => {
                                    this.setState((state,props) => {
                                    return {done: true};
                                    });
                                }}
                     />
                    <Confetti
                        style={{ display: (!this.state.done ? 'none' : 'block') }}
                        width={2000}
                        height={2000}/>
                </div>

                
                <div className="metamask-container">
                    <button className="metamask" disabled={!this.state.loader} onClick={() => this.join_pool(this.state.pool,this.state.ticker)}><span>join pool</span></button>
                </div>
                <div className="metamask-container">
                    <button className="metamask" disabled={!this.state.loader} onClick={() => this.withdraw(this.state.pool,this.state.ticker)}><span>withdraw</span></button>
                </div>

            </div>
    }



}





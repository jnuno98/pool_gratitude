pragma solidity ^0.5.1;

contract ERC20 {
    function totalSupply() public  returns (uint);
    function balanceOf(address tokenOwner) public  returns (uint balance);
    function allowance(address tokenOwner, address spender) public  returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}


contract stake {


	struct user_investment {
		uint256 start_date;
		uint256 amount;
	}


	struct pool {

		uint256 begin_date; //timestamp in unix format
		uint256 end_date;
		uint16 interest; // interest minute rate
		string description;
		uint256 min_amount;

		uint seats; //when created == 0, represents next seat available
	}



	mapping (address => mapping (address => pool)) public pools; //token => pool_address => pool
	
	mapping (address => mapping (address => mapping (address => user_investment))) public user_staking; // token => pool => user => info on his stake
	



    event Withdraw(address _token, address _pool, address _user, uint256 donation, uint256 staked);
    event Pool(address token, address pool, string description);
    event Join(address _token, address _pool, address user, uint256 amount);
//==============================================================================
//     _ _  _  _|. |`. _  _ _  .
//    | | |(_)(_||~|~|(/_| _\  .  
//==============================================================================


    

	modifier is_pool_available(address _pool ,address _token) {
		require(days_between(now,pools[_token][_pool].end_date) > 1);
		_;
	}

	modifier is_pool_allowed(address _pool, address _token) {
		require(days_between(now,pools[_token][_pool].end_date) == 0);
		_;
	}

	modifier is_user_in_pool(address _pool, address _token, address _user) {
		require(user_staking[_token][_pool][_user].start_date > 0);
		_;
	}

    modifier user_not_in_pool(address _pool, address _token, address _user) {
		require(user_staking[_token][_pool][_user].start_date == 0);
		_;
	}







//==============================================================================
//     _    |_ |. _   |`    _  __|_. _  _  _  .
//    |_)|_||_)||(_  ~|~|_|| |(_ | |(_)| |_\  .  (use these to interact with contract)
//====|=========================================================================




	function join_pool(address _pool,address _token, address _user, uint256 _amount) 
	is_pool_available(_pool,_token)
	user_not_in_pool(_pool,_token,_user)
	public payable returns (bool){

		
		require(_amount >= pools[_token][_pool].min_amount);

        ERC20 tok = ERC20(_token);
        
        uint256 _balance = tok.balanceOf(_user);
        
        require(_balance >= _amount);
        
        tok.transferFrom(_user, msg.sender, _amount);

        user_investment storage invest = user_staking[_token][_pool][_user];
        invest.amount = _amount;
        invest.start_date = now;

		pools[_token][_pool].seats++;
		
		emit Join (_token,_pool,_user,_amount);
		
		return true;

	}








	function withdraw(address _pool, address _token, address _user) 
	is_pool_allowed(_pool,_token)
	is_user_in_pool(_pool,_token,_user)
	public returns(bool)
	{

		user_investment memory _invest = user_staking[_token][_pool][_user];
		pool memory p = pools[_token][_pool];
		
		uint256 donation = _invest.amount * (p.interest/100) * days_between(_invest.start_date,p.end_date); 


        ERC20 tok = ERC20(_token);
        
        tok.transferFrom(msg.sender,_user,_invest.amount);


        user_staking[_token][_pool][_user].start_date = 0;

		emit Withdraw(_token, _pool, _user, donation, _invest.amount);
		
		return true;

	}










	function days_between(uint256 _timestamp1, uint256 _timestamp2) internal pure returns (uint) {
		require(_timestamp1 > 0 && _timestamp2 > 0 );
		if (_timestamp2 < _timestamp1) return 0;
		return (_timestamp2 - _timestamp1) / 60 ;
	}







    function get_pool_seats(address _token, address _pool) public view returns(uint256) {
        return pools[_token][_pool].seats;
    }

    function get_pool(address _token, address _pool) public view returns(uint256,uint256,uint256,uint16,string memory){
        pool memory p = pools[_token][_pool];
        return (p.begin_date, p.end_date, p.min_amount, p.interest, p.description);
    }



    function setPool (address _pool, address _token, uint256 begin, uint256 end, uint256 min, uint16 interest, string memory _description) public {
        require(pools[_token][_pool].begin_date == 0); //tests if pool already exists or no
        pool storage p = pools[_token][_pool];
        p.begin_date = begin;
        p.end_date = end;
        p.min_amount = min;
        p.interest = interest;
        p.description = _description;
        p.seats = 0;
        emit Pool(_token,_pool,_description);

    }
    
    function get_user_staking(address _pool, address _token, address _user) public view returns(uint256,uint256){
        user_investment memory u = user_staking[_token][_pool][_user];
        return (u.start_date,u.amount);
    }



}
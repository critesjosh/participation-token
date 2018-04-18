pragma solidity ^0.4.18;

import "../token/StandardToken.sol";

// mock class using StandardToken
contract StandardTokenMock is StandardToken {

  function StandardTokenMock(
            address initialAccount, 
            uint256 initialBalance) 
            public 
            DetailedERC20("NAME", "SYM", 18) 
  {
    balances[initialAccount] = initialBalance;
    totalSupply_ = initialBalance;
  }

}

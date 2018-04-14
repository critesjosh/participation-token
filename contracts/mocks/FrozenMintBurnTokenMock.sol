pragma solidity ^0.4.18;

import "../token/FrozenMintBurnToken.sol";

// mock class using StandardToken
contract FrozenMintBurnTokenMock is FrozenMintBurnToken {

  function FrozenMintBurnTokenMock(
            address initialAccount, 
            uint256 initialBalance) 
            public 
            FrozenMintBurnToken("NAME", "SYM", 18) 
  {
    balances[initialAccount] = initialBalance;
    totalSupply_ = initialBalance;
  }

}

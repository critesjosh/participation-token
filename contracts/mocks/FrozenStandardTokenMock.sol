pragma solidity ^0.4.18;

import "../token/FrozenStandardToken.sol";

// mock class using StandardToken
contract FrozenStandardTokenMock is FrozenStandardToken {

  function FrozenStandardTokenMock(address initialAccount, uint256 initialBalance) public {
    balances[initialAccount] = initialBalance;
    totalSupply_ = initialBalance;
  }

}

pragma solidity ^0.4.18;


import "../token/FrozenBasicToken.sol";


// mock class using BasicToken
contract FrozenBasicTokenMock is FrozenBasicToken {

  function FrozenBasicTokenMock(address initialAccount, uint256 initialBalance) public {
    balances[initialAccount] = initialBalance;
    totalSupply_ = initialBalance;
  }

}

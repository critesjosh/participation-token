pragma solidity ^0.4.18;

import "./FrozenMintableToken.sol";

contract SouthMichiganBlockchainersToken is FrozenMintableToken {

  string public constant name = "South Michigan Blockchainers Token"; 
  string public constant symbol = "SMB"; 
  uint8  public constant decimals = 18; 

  /*
     @dev Constructor that gives msg.sender all of existing tokens.
  */
  function SouthMichiganBlockchainersToken() public {
    totalSupply_ = 0;
  }

}
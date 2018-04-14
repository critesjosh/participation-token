pragma solidity ^0.4.18;

import "./StandardToken.sol";
import "../ownership/Ownable.sol";

/**
 * @title Standard ERC20 token
 *
 * @dev Implementation of the basic standard token.
 * @dev https://github.com/ethereum/EIPs/issues/20
 * @dev Based on code by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract StandardMintToken is StandardToken, Ownable {

  event Mint(address indexed to, uint256 amount);
  
  function StandardMintToken(
    string _name, 
    string _symbol, 
    uint8 _decimals) 
    public
    DetailedERC20(_name, _symbol, _decimals) 
  {
  }

  /*
     @dev Function to mint tokens
     @param _to The address that will receive the minted tokens.
     @param _amount The amount of tokens to mint.
     @return A boolean that indicates if the operation was successful.
  */
  function mint(address _to, uint256 _amount) onlyOwner public returns (bool) {
    totalSupply_ = totalSupply_.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    Transfer(address(0), _to, _amount);
    return true;
  }

}
pragma solidity ^0.4.18;

import "./FrozenStandardToken.sol";
import "../ownership/Ownable.sol";

/*
   @title FrozenMintBurnToken token
   @dev Simple ERC20 Token example, with mintable token creation
   @dev Issue: * https://github.com/OpenZeppelin/zeppelin-solidity/issues/120
   Based on code by TokenMarketNet: https://github.com/TokenMarketNet/ico/blob/master/contracts/MintableToken.sol
*/
contract FrozenMintBurnToken is FrozenStandardToken, Ownable {
  event Mint(address indexed to, uint256 amount);
  
  function FrozenMintBurnToken(
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

    event Burn(address indexed burner, uint256 value);

  /**
   * @dev Burns a specific amount of tokens.
   * @param _value The amount of token to be burned.
   */
  function burn(uint256 _value) public {
    require(_value <= balances[msg.sender]);
    // no need to require value <= totalSupply, since that would imply the
    // sender's balance is greater than the totalSupply, which *should* be an assertion failure

    address burner = msg.sender;
    balances[burner] = balances[burner].sub(_value);
    totalSupply_ = totalSupply_.sub(_value);
    Burn(burner, _value);
    Transfer(burner, address(0), _value);
  }
}
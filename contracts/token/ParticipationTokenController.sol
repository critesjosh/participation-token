pragma solidity ^0.4.18;

import "../math/SafeMath.sol";
import "../ownership/Ownable.sol";
import "./StandardMintToken.sol";

/*
   @title AttendanceTokenController
   @dev The ParticipationTokenController contract allows "participants" to redeem tokens
        based on signed messages from administrators. Multiple admins agree on a token amount
        and event ID and signed messages for users that can redeem the agreed on token amount
        for the chosen nonce. A nonce can't be reused by the same user.

        Token needs to have an ERC-20 compliant INTERFACE and MINT, but doesn't need to follow ERC-20
        specifications (e.g non-transferable / frokzen token). Token constructor should take 
        token details as an input.

    V2 suggestions:
      + Burn 
      + Intra-user transfer
      + Token balance based admin status
 */
contract ParticipationTokenController is Ownable {
  using SafeMath for uint256;

  //Variables
  mapping (address => mapping (uint256 => bool)) redeemedTokens;  // Whether tokens where redeemed for an ID
  mapping(uint256 => address) IDadmin;                            // The admin's address associated with the 2^i uint ID
  mapping(address => uint256) adminID;                            // The 2^i uint ID associated with the admin's address
  uint8 sigRequired;                                              // Number of signatures required to redeem tokens
  StandardMintToken public token;                                     // Token contract

  //Events
  event TokensRedeemed(address indexed _address, uint256 _amount, uint256 _nonce);
  event AdminStatusChanged(address indexed _admin, uint256 _adminID);
  event SigRequiredChanged(uint256 _sigRequired);
  event TokenOwnerChanged(address _newOwner);
  event TokenAddressChanged(address oldTokenAddress, address newTokenAddress);


  /*
     @dev Create new ParticipationToken and token controller contract
     @param _sigRequired Number of signatures required to redeem tokens
  */  
  function ParticipationTokenController(uint8 _sigRequired) 
    public 
  {    
    //Set number of signature required
    setSigRequired(_sigRequired);
  }

  /*
     @dev Set token address associated with this Controller contract.
     @param _token Address of the participation token to control access to.
  */
  function setTokenAddress(StandardMintToken _token) public onlyOwner {

    //Requires this contract to be owner of token for minting
    require(address(this) == _token.owner());
    TokenAddressChanged(token, _token);
    
    token = _token;
  }

  /*
    @dev Set number of signatures required to redeem tokens.
    @param _sigRequired New number of signature required.
  */
  function setSigRequired(uint8 _sigRequired) 
    onlyOwner 
    public 
    returns (bool)
  { 
    require(_sigRequired > 0);
    sigRequired = _sigRequired;
    
    SigRequiredChanged(_sigRequired);
    return true;
  }

 /*
     @dev Change the authorization status of a given address
     @param _admin Address to give admin status to
  */ 
  function setAsAdmin(address _admin)
      public
      onlyOwner
      returns(bool)
  {   
    //Will find the first free admin spot from 0 to 256
    for (uint256 i = 0; i<256; i++){
      if (IDadmin[2**i] == 0x0) {
        
        IDadmin[2**i] = _admin;
        adminID[_admin] = 2**i;

        AdminStatusChanged(_admin, 2**i);
        return true;
      }
    }
    return false;
  }

  /*
     @dev Remove admin status from an address
     @param _admin Address to remove admin status
  */ 
  function removeAsAdmin(address _admin)
      public
      onlyOwner
      returns(bool)
  {   
    IDadmin[adminID[_admin]] = 0x0;
    adminID[_admin] = 0;

    AdminStatusChanged(_admin, 0);
    return true;
  }

  /*
     @dev Set token's owner to new address (to allow new tokenController).
     @param _newOwner Address of new owner.
  */
  function setTokenOwner(address _newOwner) public onlyOwner {

    // Code size of new owner
    uint32 newOwnerCodeSize; 

    // Get _newOwner code size
    assembly { 
      newOwnerCodeSize := extcodesize(_newOwner) 
    }

    //Requires owner to be contract (token controller)
    require(newOwnerCodeSize > 0);
    
    // Change token ownership
    token.transferOwnership(_newOwner);

    // Trigger event
    TokenOwnerChanged(_newOwner);
  }

  /*
     @dev Allows to redeem tokens to _benificiary if possessing enough valid signed messages
     @param _beneficiary Address that is allowed to redeem tokens
     @param _amount Amounts of tokens they can claim
     @param _nonce Nonce of the event for which this message was generated
     @param _sigs Array of signatures.
  */
  function redeemTokens(
      address _beneficiary,
      uint256 _amount, 
      uint256 _nonce, 
      bytes _sigs)
      public returns (bool)
  { 
    uint256 nSigs = _sigs.length.div(65);           // Number of signatures
    require(nSigs >= sigRequired);                  // Enough signatures provided
    require(!redeemedTokens[_beneficiary][_nonce]); // Nonce's tokens not redeemed yet
 
    uint256 bitsigners;                             // Keeps track of who signed
    bytes32 r;                                      // ECDSA signature r variable
    bytes32 s;                                      // ECDSA signature s variable
    uint8 v;                                        // ECDSA signature v variable
      
    // Verifying if msg.senders provides enough valid signatures
    for(uint8 i = 0; i < sigRequired; i++) {

      // Extract ECDSA signature variables from current signature
      assembly {
        r := mload(add(_sigs, add(mul(i, 65), 32)))
        s := mload(add(_sigs, add(mul(i, 65), 64)))
        v := byte(0, mload(add(_sigs, add(mul(i, 65), 96))))
      } 

      // If signer is an admin, count
      bitsigners = bitsigners | adminID[recoverRedeemMessageSignerRSV(
                                          _beneficiary, _amount, 
                                          _nonce, r, s, v
                                        )];
    }

    //Tokens for given nonce were claimed
    redeemedTokens[_beneficiary][_nonce] = true;

    //Counting number of valid signatures
    uint8 counter = 0;

    //Count number of unique, valid signatures
    for (uint256 ii = 0; ii<256; ii++){

      if (2**ii & bitsigners == 2**ii) {
        counter++;

        if (counter == sigRequired){

          //Minting tokens to _benificiary
          token.mint(_beneficiary, _amount);

          TokensRedeemed(_beneficiary, _amount, _nonce);
          return true;

        }

      }

    }

    revert();
  }

  /*
     @dev Verifies if message was signed by an admin to give access to _add for this contract.
          Assumes Geth signature prefix.
     @param _add Address of agent with access.
     @param _amount Amount of tokens that can be claimed
     @param _nonce  Nonce of the event
     @param _sig Valid signature from owner 
  */
  function recoverRedeemMessageSigner(
      address _add, 
      uint256 _amount, 
      uint256 _nonce, 
      bytes _sig)
      view public returns (address)
  {
    bytes32 r;
    bytes32 s;
    uint8 v;

    //Extract ECDSA signature variables from `sig`
    assembly {
      r := mload(add(_sig, 32))
      s := mload(add(_sig, 64))
      v := byte(0, mload(add(_sig, 96)))
    }

    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (v < 27) {
      v += 27;
    }

    // Verifying if recovered signer is contract admin
    bytes32 hash = keccak256(this, _add, _amount, _nonce);

    //Return recovered signer address
    return ecrecover( 
              keccak256("\x19Ethereum Signed Message:\n32", hash),
              v,
              r,
              s
           );
  }

    /*
     @dev Verifies if message was signed by an admin to give access to _add for this contract.
          Assumes Geth signature prefix.
     @param _add Address of agent with access.
     @param _amount Amount of tokens that can be claimed
     @param _nonce  Nonce of the event
     @param _r r variable from ECDSA signature.
     @param _s s variable from ECDSA signature.
     @param _v v variable from ECDSA signature.
     @return Validity of access message for a given address.
  */
  function recoverRedeemMessageSignerRSV(
      address _add, 
      uint256 _amount, 
      uint256 _nonce,
      bytes32 _r,
      bytes32 _s,
      uint8 _v)
      view public returns (address)
  {

    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (_v < 27) {
      _v += 27;
    }

    // Hash of the message that had to be signed
    bytes32 hash = keccak256(this, _add, _amount, _nonce);

    //Return recovered signer address
    return ecrecover( 
              keccak256("\x19Ethereum Signed Message:\n32", hash),
              _v,
              _r,
              _s
           );
  }

  /*
     @dev Checks whether the current message is valid.
     @param _add Address of agent with access.
     @param _amount Amount of tokens that can be claimed
     @param _nonce  Nonce of the event
     @param _sig Valid signature from owner 
  */
  function isValidRedeemMessage(
      address _add, 
      uint256 _amount, 
      uint256 _nonce, 
      bytes _sig)
      view public returns (bool){
        return ( adminID[recoverRedeemMessageSigner(_add, _amount, _nonce, _sig)] > 0 );
      }

  /*
     @dev Returns admin's ID.
     @param _add Address to query admin ID.
  */
  function getAdminID(address _add) public view returns (uint256 _ID) {
    return adminID[_add];
  }

  /*
     @dev Returns the admin's address associated with an ID.
     @param _add ID (2^i) to query admin's address associated with it .
  */
  function getAdminAddress(uint256 _ID) public view returns (address _admin) {
    return IDadmin[_ID];
  }


}

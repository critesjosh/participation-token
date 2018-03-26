pragma solidity ^0.4.18;

import "../math/SafeMath.sol";
import "../ownership/Ownable.sol";
import "../token/SouthMichiganBlockchainersToken.sol";


/**
 * @title AttendanceTokenControllerTEST
 * @dev The ControlledAccess contract allows functions to be restricted to users
 * that possess a signed authorization from the owner of the contract. This signed
 * message includes the address to give permission to and the contract address.
 * Both addresses are required to prevent reusing the same authorization message
 * on different contract with same owner.
 */
contract ParticipationTokenControllerTEST is Ownable {
  using SafeMath for uint256;

  //Variables
  mapping (address => bool) admin;                                // Who can sign messages
  mapping (address => mapping (uint256 => bool)) redeemedTokens;  // Whether tokens where redeemed for an ID
  SouthMichiganBlockchainersToken public token;                   // Token contract

  //Struct
  mapping (address => bool) sigUsed; //placeholder to prevent reusing same signature
 
  uint8 sigRequired = 2; //Number of signatures required to redeem tokens


  //Variables for BITMASK
  mapping(uint256 => address) IDadmin;
  mapping(address => uint256) adminID;


  //Events
  event TokensRedeemed(address indexed _address, uint256 _amount, uint256 _nonce);
  event AdminStatusChanged(address _admin, uint256 _adminStatus);
  event SigRequiredChanged(uint256 _sigRequired);

  /*
  // Constructor (requires owner to be contract, e.g. multisig)
  function ParticipationTokenControllerTEST(
    string _name, 
    string _symbol, 
    uint8 _decimals) 
    public 
  {
    
    /*
    address sender = msg.sender;
    uint32 senderCodeSize;

    //Requires owner to be contract (multisig)
    assembly { 
      senderCodeSize := extcodesize(sender) 
    }
    require(senderCodeSize > 0);
    

    // Create new token
    token = new SouthMichiganBlockchainersToken(_name, _symbol, _decimals); 
  }
  */

  // Constructor (requires owner to be contract, e.g. multisig)
  function ParticipationTokenControllerTEST() 
    public 
  {
    
    /*
    address sender = msg.sender;
    uint32 senderCodeSize;

    //Requires owner to be contract (multisig)
    assembly { 
      senderCodeSize := extcodesize(sender) 
    }
    require(senderCodeSize > 0);
    */

    // Create new token
    token = new SouthMichiganBlockchainersToken(); 
  }
  /*
     @dev Change the authorization status of a given address
     @param _add Address to change authorization status
     @param _adminStatus Authorization status to give to address
  */ 
  function setAdminStatus(address _add, bool _adminStatus)
      public
      onlyOwner
      returns(bool)
  {      
      admin[_add] = _adminStatus;

      //AdminStatusChanged(_add, _adminStatus);
      return true;
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
     @dev Allows to redeem tokens to _benificiary if possessing enough valid signed messages
     @param _beneficiary Address that is allowed to redeem tokens
     @param _amount Amounts of tokens they can claim
     @param _nonce Nonce of the event for which this message was generated
     @param _sigs Array of signatures.
  */
  function redeemTokensARRAY(
      address _beneficiary,
      uint256 _amount, 
      uint256 _nonce, 
      bytes _sigs)
      public returns (bool)
  { 
    //Number of signatures
    uint256 nSigs = _sigs.length.div(65); 
    require(nSigs >= sigRequired);

    //Make sure tokens were not redeemed already for given nonce
    //require(!redeemedTokens[_beneficiary][_nonce]); 
 
    address[] memory signer = new address[](sigRequired);
    bytes32 r;  
    bytes32 s;
    uint8 v;
    
    // Verifying if msg.senders provides enough valid signatures
    for(uint8 i = 0; i < sigRequired; i++) {

      // Extract ECDSA signature variables from current signature
      assembly {
        r := mload(add(_sigs, add(mul(i, 65), 32)))
        s := mload(add(_sigs, add(mul(i, 65), 64)))
        v := byte(0, mload(add(_sigs, add(mul(i, 65), 96))))
      } 

      // Check validity of current signature
      signer[i] = recoverRedeemMessageSignerRSV(_beneficiary, _amount, _nonce, r, s, v);

      // If signer is an admin and if their signature wasn't already used
      require(admin[signer[i]]);
      
      //Making sure signer wasn't used already
      for (uint8 ii = 0; ii < i; ii++){
        require(signer[ii] != signer[i]);
      }
    }
    
    //Tokens for given nonce were claimed
    //redeemedTokens[_beneficiary][_nonce] = true;

    //Minting tokens to _benificiary
    token.mint(_beneficiary, _amount);
    
    TokensRedeemed(_beneficiary, _amount, _nonce);
    return true;
  }


  //ARRAY APPROACH
  function redeemTokensMAPPING(
      address _beneficiary,
      uint256 _amount, 
      uint256 _nonce, 
      bytes _sigs)
      public returns (bool)
  { 
    //Number of signatures
    uint256 nSigs = _sigs.length.div(65); 
    require(nSigs >= sigRequired);

    //Make sure tokens were not redeemed already for given nonce
    //require(!redeemedTokens[_beneficiary][_nonce]); 
 
    address[] memory signer = new address[](sigRequired);
    bytes32 r;  
    bytes32 s;
    uint8 v;
    
    // Verifying if msg.senders provides enough valid signatures
    for(uint8 i = 0; i < sigRequired; i++) {

      // Extract ECDSA signature variables from current signature
      assembly {
        r := mload(add(_sigs, add(mul(i, 65), 32)))
        s := mload(add(_sigs, add(mul(i, 65), 64)))
        v := byte(0, mload(add(_sigs, add(mul(i, 65), 96))))
      } 

      // Check validity of current signature
      signer[i] = recoverRedeemMessageSignerRSV(_beneficiary, _amount, _nonce, r, s, v);

      // If signer is an admin and if their signature wasn't already used
      require(admin[signer[i]]);

      // Signature from signer has been used
      sigUsed[signer[i]] = true;
    }

    //Tokens for given nonce were claimed
    //redeemedTokens[_beneficiary][_nonce] = true;

    //Minting tokens to _benificiary
    token.mint(_beneficiary, _amount);

    //Clearing sigUsed
    for (i = 0; i < sigRequired; i++){
      sigUsed[signer[i]] = false;
    }
    
    TokensRedeemed(_beneficiary, _amount, _nonce);
    return true;
  } 






  // BITMASK APPROACH

  function setIDadmin(address _admin, uint256 _ID) public {
    require(IDadmin[_ID] == 0x0);


    IDadmin[_ID] = _admin;
    adminID[_admin] = _ID;
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

        //AdminStatusChanged(_admin, 2**i);
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

    //AdminStatusChanged(_admin, 0);
    return true;
  }
  

  function redeemTokensBITMASK(
      address _beneficiary,
      uint256 _amount, 
      uint256 _nonce, 
      bytes _sigs)
      public returns (bool)
  { 
    uint256 nSigs = _sigs.length.div(65);           // Number of signatures
    require(nSigs >= sigRequired);                  // Enough signatures provided
    //require(!redeemedTokens[_beneficiary][_nonce]); // Nonce's tokens not redeemed yet
 
    uint256 bitsigners; // Keeps track of who signed
    address signer;     // Address of currently recovered signer
    bytes32 r;          // ECDSA signature r variable
    bytes32 s;          // ECDSA signature s variable
    uint8 v;            // ECDSA signature v variable
    
    // Verifying if msg.senders provides enough valid signatures
    for(uint8 i = 0; i < sigRequired; i++) {

      // Extract ECDSA signature variables from current signature
      assembly {
        r := mload(add(_sigs, add(mul(i, 65), 32)))
        s := mload(add(_sigs, add(mul(i, 65), 64)))
        v := byte(0, mload(add(_sigs, add(mul(i, 65), 96))))
      } 

      // Check validity of current signature
      signer = recoverRedeemMessageSignerRSV(_beneficiary, _amount, _nonce, r, s, v);

      // If signer is an admin, count
      bitsigners = bitsigners | adminID[signer];

    }

    //Tokens for given nonce were claimed
    //redeemedTokens[_beneficiary][_nonce] = true;

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

    return false;
  }

  // SEOCND VERSION 


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
     @dev Returns whether the address is an admin or not.
     @param _add Address to query admin status.
  */
  function getAdminStatus(address _add) public view returns (bool) {
    return admin[_add];
  }

    /*
     @dev Returns admin's ID.
     @param _add Address to query admin ID.
  */
  function getAdminID(address _add) public view returns (uint256) {
    return adminID[_add];
  }

  /*
     @dev Returns the admin's address associated with an ID.
     @param _add ID (2^i) to query admin's address associated with it .
  */
  function getAdminAddress(uint256 _ID) public view returns (address) {
    return IDadmin[_ID];
  }


}

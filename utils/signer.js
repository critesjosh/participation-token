// Web3
var Web3 = require('web3');

//Infura web3 instance
var web3 = new Web3(
    new Web3.providers.HttpProvider('https://rinkeby.infura.io/')
);

// other packages
const BigNumber = web3.BigNumber;
const Web3Utils = require('web3-utils');

// Variables
var functionToCall = 'redeemTokens(address,uint256,uint256,bytes)'  // Function to call
var methodID = Web3Utils.sha3(functionToCall).substr(0, 10);       // Function encoding
  
/*
   @dev Takes an uint (>0), converts it to hex and pad it to obtain a byte32 array
   @param uint Unsigned integer
*/
function toHexPad64(uint){
  if (uint < 1){ throw "toHex_Pad64 THROW : uint should be larger than 0"}

  var num = Web3Utils.toHex(uint);
  return Web3Utils.padLeft(num, 64);
}

/*
  @dev Takes an array of addresses to sign with corresponding parameters
  @param addresses Array of address of participants
  @param amount Amount of tokens that participants can redeem for a given event
  @param nonce Event ID number
*/
function massSign(contractAddress, addresses, amount, nonce){
  var add;   // Address without 0x
  var add0x; // Address with 0x
  var m;     // Signed message

  var encodedAddr;   // Encoded address
  var encodedAmount; // Encoded amount
  var encodedNonce;  // Encoded nonde

  var encodedFunctionCall; //Encoded function call for given user and signature


  // Object that maps `address => signedMessage`
  var encodedFunctionCalls = new Object();

  for (var i=0; i<addresses.length; i++){
    
    //Current address
    add = addresses[i];

    // Removing 0x if found
    if (add.substr(0,2) == '0x'){
      add0x = add;
      add   = add.substr(2);
    } else {
      add0x = '0x'+ add;
    }

    // Signed message
    m = Web3Utils.soliditySha3(
                contractAddress,
                add,
                amount,
                nonce
        ); 

    // Encoding each argument
    encodedAddr   = Web3Utils.padLeft(add, 64); 
    encodedAmount = toHexPad64(amount).substr(2);
    encodedNonce  = toHexPad64(nonce).substr(2);

    // The byte code to pass as msg.data for users to redeem their tokens
    encodedFunctionCall = methodID + encodedAddr + encodedAmount + encodedNonce + m;
    
    //Storing signed message for each address (overwrites duplicated addresses)
    encodedFunctionCalls[add0x] = encodedFunctionCall;
  }

return encodedFunctionCalls;
}


//Example
/*
var amount = 69;
var nonce  = 1;
var contract = '0x0000000000000000000000000000000000000000';
var addresses = [
    "0x0734648f6a0294968861818904d1acddedf7302cb",
    "0xdf08f82de32b8d460adbe8d72043e3a7e25a3b391",
    "0x6704fbfcd5ef766b287262fa2281c105d57246a6",
    "0x9e1ef1ec212f5dffb41d35d9e5c14054f26c6560",
    "0xce42bdb34189a93c55de250e011c68faee374dd3",
    "0x97a3fc5ee46852c1cf92a97b7bad42f2622267cc",
    "0xb9dcbf8a52edc0c8dd9983fcc1d97b1f5d975ed7",
    "0x26064a2e2b568d9a6d01b93d039d1da9cf2a58cd",
    ];

var calls = massSign(contract, addresses, amount, nonce);

// Printing
for (var i = 0; i < addresses.length; i++){
  console.log(i, calls[addresses[i]]);
}

*/
var Web3 = require("web3")
var TruffleContract = require("truffle-contract")
var ptcJSON = require("../build/contracts/ParticipationTokenController.json")
var ptcContract = TruffleContract(ptcJSON)


var provider = new Web3.providers.HttpProvider('http://localhost:8082');

var web3 = new Web3(provider);
//var provider = "https://rinkeby.infura.io/ZSmezmc18YljFk4J62Se";

ptcContract.setProvider(provider)



module.exports = {
    
    instance: async() => {
        return await ptcContract.deployed()
    }
}
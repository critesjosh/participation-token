// NOTE: Use this file to easily deploy the contracts you're writing.
//   (but make sure to reset this file before committing
//    with `git checkout HEAD -- migrations/2_deploy_contracts.js`)

var ParticipationTokenController = artifacts.require('ParticipationTokenController');

// Token and TokenController parameters
var NAME = 'South-Michigan Participation Token';
var SYMBOL = 'SMIPT';
var DECIMALS = 18;
var SIGREQUIRED = 2;

module.exports = function (deployer, network) {

  if (network == 'testrpc') {
    //Deploying contract
    deployer.deploy(
      ParticipationTokenController,
      NAME,
      SYMBOL,
      DECIMALS,
      SIGREQUIRED
    );

    //Printing contract ABI
    ParticipationTokenController.deployed().then(instance => {
      console.log(instance.abi);
    });
  };
};

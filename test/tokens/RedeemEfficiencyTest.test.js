import ether from '../helpers/ether';
import expectEvent from '../helpers/expectEvent';

const BigNumber = web3.BigNumber;
const Web3Utils = require('web3-utils');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const AttendanceTokenControllerTEST = artifacts.require('AttendanceTokenControllerTEST');
const SouthMichiganBlockchainersToken = artifacts.require('SouthMichiganBlockchainersToken');


contract('AttendanceTokenControllerTEST', function ([_, owner, admin1, admin2, authorized, unauthorized, anyone]) {
  const name   = 'TOKEN';
  const symb   = 'TKN';
  const dec    = 18;
  const amount = '100';
  const nonce  = '1';

  describe.skip('Efficiency test for redeeming token methods', function (){
    beforeEach(async function () {
      this.controller = await AttendanceTokenControllerTEST.new({from: owner});
    });

    describe('redeemTokensMAPPING()', function () { 
      it('Gas cost when faking updating state variable', async function () {
        let acc = web3.eth.accounts;
        var sig;
        var sigConc = '0x';1
        let m = Web3Utils.soliditySha3(
            this.controller.address,
            authorized,
            amount,
            nonce
        );

        for ( var i = 0; i < 10; i++){
          await this.controller.setSigRequired(i+1, {from: owner});
          await this.controller.setAdminStatus(acc[i], true, {from : owner});

          sig = await web3.eth.sign(acc[i], m);
          sigConc = sigConc + sig.substr(2);
          var tx = await this.controller.redeemTokensMAPPING(authorized, amount, nonce, sigConc);
          console.log('          ' + (i+1) + ' SigRequired : ', tx.receipt.gasUsed, 'gas used');
        };
      });
    });

    describe('redeemTokensARRAY()', function () { 
      it('Gas cost when looping over the signer address', async function () {

        let acc = web3.eth.accounts;
        var sig;
        var sigConc = '0x';
        let m = Web3Utils.soliditySha3(
            this.controller.address,
            authorized,
            amount,
            nonce
        );

        for ( var i = 0; i < 10; i++){
          await this.controller.setSigRequired(i+1, {from: owner});
          await this.controller.setAdminStatus(acc[i], true, {from : owner});

          sig = await web3.eth.sign(acc[i], m);
          sigConc = sigConc + sig.substr(2);
          var tx = await this.controller.redeemTokensARRAY(authorized, amount, nonce, sigConc);
          console.log('          ' + (i+1) + ' SigRequired :', tx.receipt.gasUsed, 'gas used');
        };

      });
    });


    describe('redeemTokensBITMASK()', function () { 
      it('Gas cost when using a bit mask with signers uint256 IDs', async function () {

        let acc = web3.eth.accounts;
        var sig;
        var sigConc = '0x';
        let m = Web3Utils.soliditySha3(
            this.controller.address,
            authorized,
            amount,
            nonce
        );

        for ( var i = 0; i < 10; i++){
          await this.controller.setSigRequired(i+1, {from: owner});
          await this.controller.setAsAdmin(acc[i], {from : owner});

          sig = await web3.eth.sign(acc[i], m);
          sigConc = sigConc + sig.substr(2);
          var tx = await this.controller.redeemTokensBITMASK(authorized, amount, nonce, sigConc);
          console.log('          ' + (i+1) + ' SigRequired : ', tx.receipt.gasUsed, 'gas used');
        };

      });
    });
  });
});

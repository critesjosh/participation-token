import ether from '../helpers/ether';
import expectEvent from '../helpers/expectEvent';

const BigNumber = web3.BigNumber;
const Web3Utils = require('web3-utils');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const ParticipationTokenController = artifacts.require('ParticipationTokenController');
const FrozenMintableToken = artifacts.require('FrozenMintableToken');


contract('ParticipationTokenController', function ([_, owner, admin1, admin2, authorized, unauthorized, anyone]) {
  const name   = 'TOKEN';
  const symb   = 'TKN';
  const dec    = 18;
  const sigReq = 2;
  const amount = '100';
  const nonce  = '1';

  context('Once ParticipationTokenController is deployed', function (){
    beforeEach(async function () {
      this.controller = await ParticipationTokenController.new(name, symb, dec, sigReq, {from: owner});
      let token = await this.controller.token();
      this.token = await FrozenMintableToken.at(token);
    });

    it('should set token owner to ParticipationTokenController contract', async function () {
      let tokenOwner = await this.token.owner();
      tokenOwner.should.be.equal(this.controller.address);
    });


    describe('Admin related functions', function () {
      it('should allow owner to set admin', async function () {
        await this.controller.setAsAdmin(admin1, {from : owner}).should.be.fulfilled;
      });

      it('should allow owner to remove admin', async function () {
        await this.controller.removeAsAdmin(admin1, {from : owner}).should.be.fulfilled;
      });

      it('should emit event when admin is added', async function () {
        await expectEvent.inTransaction(
          this.controller.setAsAdmin(admin1, {from : owner}),
          'AdminStatusChanged'
        );
      });

      it('should emit event when admin is removed', async function () {
        await expectEvent.inTransaction(
          this.controller.removeAsAdmin(admin1, {from : owner}),
          'AdminStatusChanged'
        );
      });

      it('should allow NOT allow anyone to set admin', async function () {
        await this.controller.setAsAdmin(admin1, {from: anyone}).should.be.rejected;
      });

      it('should allow NOT allow anyone to remove admin', async function () {
        await this.controller.removeAsAdmin(admin1, {from: anyone}).should.be.rejected;
      });

    });

    describe('Token related functions', function () {
      it('should allow owner to call #setTokenOwner', async function () {
        await this.controller.setTokenOwner(this.controller.address, {from : owner}).should.be.fulfilled;
      });

      it('should emit event when #setTokenOwner call is successful', async function () {
        await expectEvent.inTransaction(
          this.controller.setTokenOwner(this.controller.address, {from : owner}),
          'TokenOwnerChanged'
        );
      });

      it('should allow NOT allow anyone to call #setTokenOwner', async function () {
        await this.controller.setTokenOwner(this.controller.address, {from: anyone}).should.be.rejected;
      });
    }); 

    describe('signature related functions', function () {
      it('should allow owner to set admin sigRequired', async function () {
        await this.controller.setSigRequired(2, {from : owner}).should.be.fulfilled;
      });

      it('should emit event when sigRequired is changed', async function () {
        await expectEvent.inTransaction(
          this.controller.setSigRequired(2, {from : owner}),
          'SigRequiredChanged'
        );
      });

      it('should allow NOT allow anyone to set sigRequired', async function () {
        await this.controller.setSigRequired(2, {from: anyone}).should.be.rejected;
      });


      describe('message validity', function () {
        let sig1; // Message to sign

        beforeEach(async function () {
          await this.controller.setAsAdmin(admin1, {from : owner});
          let m = Web3Utils.soliditySha3(
                  this.controller.address,
                  authorized.substr(2),
                  amount,
                  nonce
              );
          // Create the signature using admin1
          sig1 = web3.eth.sign(admin1, m);
        });

        it('should accept valid message to authorized user', async function () {
          const isValidMessage = await this.controller.isValidRedeemMessage(authorized, amount, nonce, sig1);
          isValidMessage.should.equal(true);       
        });


        it('should reject invalid message to unauthorized user', async function () {
          const isValidMessage = await this.controller.isValidRedeemMessage(unauthorized, amount, nonce, sig1);
          isValidMessage.should.equal(false);
        });

        context('when 2 admins required', function () {
          let sig2;

          beforeEach(async function () {
            await this.controller.setSigRequired(2, {from: owner});
            await this.controller.setAsAdmin(admin2, {from : owner});
            let m = Web3Utils.soliditySha3(
                  this.controller.address,
                  authorized.substr(2),
                  amount,
                  nonce
              );
            // Create the signature using admin1
            sig2 = web3.eth.sign(admin2, m);
          });

          it('should allow calls to #redeemToken with 2 valid signatures', async function () {
            await this.controller.redeemTokens(authorized, amount, nonce, sig1 + sig2.substr(2)).should.be.fulfilled;
          });

          it('should emit event when tokens are redeemed', async function () {
            await expectEvent.inTransaction(
              this.controller.redeemTokens(authorized, amount, nonce, sig1 + sig2.substr(2)),
              'TokensRedeemed'
            );
          });

          it('should NOT allow calls to #redeemToken with invalid signatures', async function () {
            await this.controller.redeemTokens(unauthorized, amount, nonce, sig1 + sig2.substr(2)).should.be.rejected;
          });

          it('should NOT allow calls to #redeemToken with not enough signatures', async function () {
            await this.controller.redeemTokens(authorized, amount, nonce, sig1).should.be.rejected;
          });

          it('should NOT allow calls to #redeemToken with duplicated valid signature', async function () {
            await this.controller.redeemTokens(authorized, amount, nonce, sig1 + sig1.substr(2)).should.be.rejected;
          });

          context('once tokens are redeemed with the 2 signatures', function (){
            beforeEach(async function () {
              await this.controller.redeemTokens(authorized, amount, nonce, sig1 + sig2.substr(2));
            });

            it('should NOT allow redeeming with same signature for a given nonce', async function (){
              await this.controller.redeemTokens(authorized, amount, nonce, sig1 + sig2.substr(2)).should.be.rejected;
            });

            it('should set the balance of @_beneficiary to @amount', async function (){
              let userBalance = await this.token.balanceOf(authorized);
              userBalance.should.be.bignumber.equal(amount);
            });

            it('should set @totalSupply_ to @amount', async function (){
              let totalSupply_ = await this.token.totalSupply();
              totalSupply_.should.be.bignumber.equal(amount);
            });
          });

        });
      });
    });
  });
});

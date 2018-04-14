import assertRevert from '../helpers/assertRevert';

const FrozenMintBurnTokenMock = artifacts.require('FrozenMintBurnTokenMock');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('FrozenMintBurnToken', function ([owner, anyone]) {
  beforeEach(async function () {
    this.token = await FrozenMintBurnTokenMock.new(owner, 1000, { from: owner });
  });

  describe('mint', function () {
    const amount = 100;

    describe('when the sender is the token owner', function () {

      it('mints the requested amount', async function () {
        await this.token.mint(owner, amount, { from: owner });

        const balance = await this.token.balanceOf(owner);
        balance.should.be.bignumber.equal(amount + 1000);
      });

      it('emits a mint finished event', async function () {
        const { logs } = await this.token.mint(owner, amount, { from: owner });

        assert.equal(logs.length, 2);
        assert.equal(logs[0].event, 'Mint');
        assert.equal(logs[0].args.to, owner);
        assert.equal(logs[0].args.amount, amount);
        assert.equal(logs[1].event, 'Transfer');
      });
    });

    describe('when the sender is not the token owner', function () {
 
      it('reverts', async function () {
        await assertRevert(this.token.mint(owner, amount, { from: anyone }));
      });

    });
  });

 describe('burn', function () {
    const from = owner;

    describe('when the given amount is not greater than balance of the sender', function () {
      const amount = 100;

      it('burns the requested amount', async function () {
        await this.token.burn(amount, { from });

        const balance = await this.token.balanceOf(from);
        assert.equal(balance, 900);
      });

      it('emits a burn event', async function () {
        const { logs } = await this.token.burn(amount, { from });
        const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
        assert.equal(logs.length, 2);
        assert.equal(logs[0].event, 'Burn');
        assert.equal(logs[0].args.burner, owner);
        assert.equal(logs[0].args.value, amount);

        assert.equal(logs[1].event, 'Transfer');
        assert.equal(logs[1].args.from, owner);
        assert.equal(logs[1].args.to, ZERO_ADDRESS);
        assert.equal(logs[1].args.value, amount);
      });
    });

    describe('when the given amount is greater than the balance of the sender', function () {
      const amount = 1001;

      it('reverts', async function () {
        await assertRevert(this.token.burn(amount, { from }));
      });
    });
  });


});

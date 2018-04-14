import assertRevert from '../helpers/assertRevert';
const FrozenMintBurnToken = artifacts.require('FrozenMintBurnToken');

contract('FrozenMintBurnToken', function ([owner, anyone]) {
  beforeEach(async function () {
    this.token = await FrozenMintBurnToken.new('NAME', 'SYM', 18, { from: owner });
  });

  describe('mint', function () {
    const amount = 100;

    describe('when the sender is the token owner', function () {

      it('mints the requested amount', async function () {
        await this.token.mint(owner, amount, { from: owner });

        const balance = await this.token.balanceOf(owner);
        assert.equal(balance, amount);
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
});

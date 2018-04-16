import assertRevert from '../helpers/assertRevert';
var BasicTokenTest = require('./BasicTokenWrap')

const BasicTokenMock = artifacts.require('BasicTokenMock');

contract('BasicToken', function ([_, owner, recipient, anotherAccount]) {

  beforeEach(async function () {
    this.token = await BasicTokenMock.new(owner, 100);
  });

  BasicTokenTest.shouldBehaveLikeBasicToken();
});

import assertRevert from '../helpers/assertRevert';
var standardTokenTest = require('./StandardTokenWrap')

const StandardTokenMock = artifacts.require('StandardTokenMock');

contract('StandardTokenMock', function ([_, owner, recipient, anotherAccount]) {

  beforeEach(async function () {
    this.token = await StandardTokenMock.new(owner, 100);
  });

  standardTokenTest.shouldBehaveLikeStandardToken();
});

import assertRevert from '../helpers/assertRevert';
var standardTokenTest = require('./StandardTokenWrap')

const FrozenStandardTokenMock = artifacts.require('FrozenStandardTokenMock');

contract('FrozenStandardToken', function ([_, owner, recipient, anotherAccount]) {

	beforeEach(async function () {
	  this.token = await FrozenStandardTokenMock.new(owner, 100);
	});

	standardTokenTest.shouldNOTBehaveLikeStandardToken();
});

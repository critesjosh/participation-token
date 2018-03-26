import assertRevert from '../helpers/assertRevert';
var BasicTokenTest = require('./BasicTokenWrap')

const FrozenBasicTokenMock = artifacts.require('FrozenBasicTokenMock');

contract('FrozenBasicToken', function ([_, owner, recipient, anotherAccount]) {

	beforeEach(async function () {
	  this.token = await FrozenBasicTokenMock.new(owner, 100);
	});

	BasicTokenTest.shouldNOTBehaveLikeBasicToken();
});

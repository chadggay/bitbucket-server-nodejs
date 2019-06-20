var assert = require('assert');
var sinon = require('sinon');
var BitbucketClient = require('../../index.js').Client;
var request = require('request-promise');
var Promise = require('bluebird');

describe('Update Projects', function() {
  var requestPut, bitbucketClient;
  var oauth = require('../mocks/oauth');

  beforeEach(function() {
    bitbucketClient = new BitbucketClient('http://localhost/', oauth);
    requestPut = sinon.stub(request, 'put');
  });

  afterEach(function() {
    requestPut.restore();
  });

  it('should update a project', function(done) {
    // Mock the HTTP Client put.
    var requestData = {
      name: 'My Cool Updated Project',
      description: 'The description for my cool updated project.',
      avatar: 'data:image/png;base64,<base64-encoded-image-data>'
    };
    var expected = require('../mocks/projects-put.json');
    requestPut.returns(Promise.resolve(expected));

    // Test projects.put API.
    bitbucketClient.projects.put('PRJ', requestData).then(function(project) {
      assert.equal('PRJ', project.key);
      assert.equal(requestData.name, project.name);
      assert.equal(requestData.description, project.description);
      assert.equal(
        requestPut.getCall(0).args[0].uri,
        'http://localhost/projects/PRJ'
      );
      assert.equal(requestPut.getCall(0).args[0].oauth, oauth);

      done();
    });
  });
});

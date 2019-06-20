var assert = require('assert');
var sinon = require('sinon');
var BitbucketClient = require('../../index.js').Client;
var request = require('request-promise');
var Promise = require('bluebird');

describe('Update Repositories', function() {
  var requestPut, bitbucketClient;
  var oauth = require('../mocks/oauth');

  beforeEach(function() {
    bitbucketClient = new BitbucketClient('http://localhost/', oauth);
    requestPut = sinon.stub(request, 'put');
  });

  afterEach(function() {
    requestPut.restore();
  });

  it('should create a project', function(done) {
    // Mock the HTTP Client put.
    var requestData = {
      description: 'My updated repo description'
    };
    var expected = require('../mocks/repos-put.json');
    requestPut.returns(Promise.resolve(expected));

    // Test repos.put API.
    bitbucketClient.repos
      .put('PRJ', 'my-repo', requestData)
      .then(function(repo) {
        assert.equal(requestData.description, repo.description);
        assert.equal('PRJ', repo.project.key);
        assert.equal('my-repo', repo.slug);
        assert.equal(
          requestPut.getCall(0).args[0].uri,
          'http://localhost/projects/PRJ/repos/my-repo'
        );
        assert.equal(requestPut.getCall(0).args[0].oauth, oauth);

        done();
      });
  });
});

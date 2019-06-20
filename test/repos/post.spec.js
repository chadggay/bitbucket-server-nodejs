var assert = require('assert');
var sinon = require('sinon');
var BitbucketClient = require('../../index.js').Client;
var request = require('request-promise');
var Promise = require('bluebird');

describe('Create Repositories', function() {
  var requestPost, bitbucketClient;
  var oauth = require('../mocks/oauth');

  beforeEach(function() {
    bitbucketClient = new BitbucketClient('http://localhost/', oauth);
    requestPost = sinon.stub(request, 'post');
  });

  afterEach(function() {
    requestPost.restore();
  });

  it('should create a repository', function(done) {
    // Mock the HTTP Client post.
    var requestData = {
      name: 'My repo',
      scmId: 'git',
      forkable: true
    };
    var expected = require('../mocks/repos-post.json');
    requestPost.returns(Promise.resolve(expected));

    // Test repos.post API.
    bitbucketClient.repos.post('PRJ', requestData).then(function(repo) {
      assert.equal(requestData.name, repo.name);
      assert.equal(requestData.scmId, repo.scmId);
      assert.equal(requestData.forkable, repo.forkable);
      assert.equal('PRJ', repo.project.key);
      assert.equal(
        requestPost.getCall(0).args[0].uri,
        'http://localhost/projects/PRJ/repos'
      );
      assert.equal(requestPost.getCall(0).args[0].oauth, oauth);

      done();
    });
  });
});

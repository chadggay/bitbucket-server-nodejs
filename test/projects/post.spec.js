var assert = require('assert');
var sinon = require('sinon');
var BitbucketClient = require('../../index.js').Client;
var request = require('request-promise');
var Promise = require('bluebird');

describe('Create Projects', function() {
  var requestPost, bitbucketClient;
  var oauth = require('../mocks/oauth');

  beforeEach(function() {
    bitbucketClient = new BitbucketClient('http://localhost/', oauth);
    requestPost = sinon.stub(request, 'post');
  });

  afterEach(function() {
    requestPost.restore();
  });

  it('should create a project', function(done) {
    // Mock the HTTP Client post.
    var requestData = {
      key: 'PRJ',
      name: 'My Cool Project',
      description: 'The description for my cool project.',
      avatar: 'data:image/png;base64,<base64-encoded-image-data>'
    };
    var expected = require('../mocks/projects-post.json');
    requestPost.returns(Promise.resolve(expected));

    // Test projects.post API.
    bitbucketClient.projects.post(requestData).then(function(project) {
      assert.equal(requestData.key, project.key);
      assert.equal(requestData.name, project.name);
      assert.equal(requestData.description, project.description);
      assert.equal(
        requestPost.getCall(0).args[0].uri,
        'http://localhost/projects'
      );
      assert.equal(requestPost.getCall(0).args[0].oauth, oauth);

      done();
    });
  });
});

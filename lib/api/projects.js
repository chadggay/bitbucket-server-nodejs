'use strict';

module.exports = function(client) {
  return {
    get: function(options) {
      return client.getCollection('projects', options);
    },
    post: function(options) {
      return client.post('projects', options);
    },
    put: function(projectKey, options) {
      return client.put('projects/' + projectKey, options);
    }
  };
};

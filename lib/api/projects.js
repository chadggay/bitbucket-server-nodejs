'use strict';

module.exports = function(client) {
  return {
    get: function(options) {
      return client.getCollection('projects', options);
    },
    post: function(data) {
      return client.post('projects', data);
    },
    put: function(projectKey, data) {
      return client.put('projects/' + projectKey, data);
    }
  };
};

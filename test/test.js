var server = require(__dirname + '/../bin/server');

describe('Api server server', function () {

  before(function () {
    server.disableLog();
    server.start();
  });

  require(__base + 'test/ping');
  require(__base + 'test/v1/test');
});
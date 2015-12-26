var request = require('request');
var expect = require('chai').expect;
var config = require(__base + 'config');
var url = config.server.fullUrl + '/ping';

describe('Testing /ping', function () {

  describe('GET /ping : Check api is up', function() {

    it('Should reply with pong', function (done) {

      request.get(url, function (err, res, body) {

        expect(res.statusCode).to.equal(200);
        expect(body).to.equal('pong');
        done();
      });
    });
  });
});
var request = require('request');
var expect = require('chai').expect;

var config = require(__base + 'config');
var userUrl = config.server.fullUrl + '/v1/user';
var userModel = require(__base + 'app/model/user');

describe('Testing /v1/user', function () {

  describe('POST /v1/user : User creation', function() {

    before(function () {
      userModel.remove({email: config.test.user.email}, function (err) {

      });
    });

    it ('Should reply Unauthenticated response when client not authenticate', function (done) {

      request.post({
        url: userUrl,
        form: {
          email: config.test.user.email,
          password: config.test.user.password
        }
      }, function (err, res, body) {

        var reply = JSON.parse(body);

        expect(res.statusCode).to.equal(401);
        expect(reply.status).to.not.be.undefined;
        expect(reply.status).to.equal(401);
        expect(reply.error).to.not.be.undefined;
        expect(reply.error).to.equal('Unauthorized request');
        done();
      });
    });


    it ('Should reply Unauthenticated response when client authenticate with wrong secret', function (done) {

      request.post({
        url: userUrl,
        form: {
          email: config.test.user.email,
          password: config.test.user.password
        },
        headers: {
          Authorization: 'Basic ' + config.test.client.clientSecret + 'r'
        }
      }, function (err, res, body) {

        var reply = JSON.parse(body);

        expect(res.statusCode).to.equal(401);
        expect(reply.status).to.not.be.undefined;
        expect(reply.status).to.equal(401);
        expect(reply.error).to.not.be.undefined;
        expect(reply.error).to.equal('Unauthorized request');
        done();
      });
    });


    it ('Should reply Invalid request response when body is incomplete', function (done) {

      request.post({
        url: userUrl,
        form: {
          email: config.test.user.email
        },
        headers: {
          Authorization: 'Basic ' + config.test.client.clientSecret
        }
      }, function (err, res, body) {

        var reply = JSON.parse(body);

        expect(res.statusCode).to.equal(400);
        expect(reply.status).to.not.be.undefined;
        expect(reply.status).to.equal(400);
        expect(reply.error).to.not.be.undefined;
        expect(reply.error).to.equal('Invalid request');
        done();
      });
    });


    it ('Should reply Invalid request response when email address is wrong', function (done) {

      request.post({
        url: userUrl,
        form: {
          email: config.test.user.pseudo,
          password: config.test.user.password
        },
        headers: {
          Authorization: 'Basic ' + config.test.client.clientSecret
        }
      }, function (err, res, body) {

        var reply = JSON.parse(body);

        expect(res.statusCode).to.equal(400);
        expect(reply.status).to.not.be.undefined;
        expect(reply.status).to.equal(400);
        expect(reply.error).to.not.be.undefined;
        expect(reply.error).to.equal('Invalid email address');
        done();
      });
    });



    it ('Should reply Invalid request response when password is too short', function (done) {

      request.post({
        url: userUrl,
        form: {
          email: config.test.user.email,
          password: 'a'
        },
        headers: {
          Authorization: 'Basic ' + config.test.client.clientSecret
        }
      }, function (err, res, body) {

        var reply = JSON.parse(body);

        expect(res.statusCode).to.equal(400);
        expect(reply.status).to.not.be.undefined;
        expect(reply.status).to.equal(400);
        expect(reply.error).to.not.be.undefined;
        expect(reply.error).to.equal('Password too short');
        done();
      });
    });


    it ('Should create new user when request is valid', function (done) {

      request.post({
        url: userUrl,
        form: {
          email: config.test.user.email,
          password: config.test.user.password
        },
        headers: {
          Authorization: 'Basic ' + config.test.client.clientSecret
        }
      }, function (err, res, body) {

        var reply = JSON.parse(body);

        expect(res.statusCode).to.equal(201);
        expect(reply.email).to.not.be.undefined;
        expect(reply.email).to.equal(config.test.user.email);
        done();
      });
    });


    it ('Should reply a conflict error when using a existing email address', function (done) {

      request.post({
        url: userUrl,
        form: {
          email: config.test.user.email,
          password: config.test.user.password
        },
        headers: {
          Authorization: 'Basic ' + config.test.client.clientSecret
        }
      }, function (err, res, body) {

        var reply = JSON.parse(body);

        expect(res.statusCode).to.equal(409);
        expect(reply.status).to.not.be.undefined;
        expect(reply.status).to.equal(409);
        expect(reply.error).to.not.be.undefined;
        expect(reply.error).to.equal('Email address already used');
        done();
      });
    });

  });
});
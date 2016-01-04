var express = require('express');
var router = express.Router();

var error = require(__base + 'app/misc/error');
var logger = require(__base + 'bin/logger');


router.post('', function (req, res, next) {

  logger.info('Receive an facebook link request');

  //Check user authenticated
  if (req.authType != 'user') {
    next(error.unauthorizedError);
  }
  else {

    //Check if user as already link its facebook
    if (req.authUser.facebookId != undefined) {
      next(error.userAlreadyFacebook);
    }
    else {
      //Check request
      if (req.body.facebookId == undefined
        || req.body.lastName == undefined
        || req.body.firstName == undefined
        || req.body.facebookFriends == undefined
        || Array.isArray(req.body.facebookFriends) == false) {
        next(error.invalidRequestError);
      }
      else {
        req.authUser.addFacebookData(req.body.facebookId,
          req.body.lastName, req.body.firstName, req.body.facebookFriends,
          function (err) {
            if (err) {
              logger.error('Unable to update user ...');
              next(err.internalServerError);
            }
            else {
              logger.info('User updated (' + req.authUser.firstName + ')');
              res.status(200);
              res.send({
                email: req.authUser.email,
                publicId: req.authUser.publicId,
                facebookId: req.authUser.facebookId,
                firstName: req.authUser.firstName,
                lastName: req.authUser.lastName,
                pseudo: req.authUser.pseudo
              });
            }

          });
      }
    }
  }


});
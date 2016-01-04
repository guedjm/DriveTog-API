var express = require('express');
var router = express.Router();

var error = require(__base + 'app/misc/error');
var userModel = require(__base + 'app/model/user');
var logger = require(__base + 'bin/logger');

/**
 * POST /v1/user -> create user
 */
router.post('', function (req, res, next) {

  logger.info('Receive an user creation request');

  //Check client authenticated
  if (req.authType != 'client') {
    next(error.unauthorizedError);
  }
  else {
    //Check request
    if (req.body.email == undefined || req.body.password == undefined) {
      next(error.invalidRequestError);
    }
    else {

      var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

      //Check email address
      if (req.body.email.search(emailRegEx) == 0) {

        //Check password length
        if (req.body.password.length > 4) {

          //Check user exist
          userModel.getUserByEmail(req.body.email, function (err, existingUser) {
            if (err) {
              logger.error('Unable to retrieve user');
              next(error.internalServerError);
            }
            else if (existingUser != undefined) {
              logger.info('Email address already assigned to an user');
              next(error.userAlreadyExistError);
            }
            else {

              //Create user
              userModel.createNewUser(req.body.email, req.body.password, req.clientRequest._id, function (err, newUser) {
                  if (err || newUser == undefined) {
                    logger.error('Unable to create new user');
                    next(error.internalServerError);
                  }
                  else {
                    logger.info('User ' + newUser.email + ' created');

                    res.status(201);
                    res.send({
                      email: newUser.email,
                      public_id: newUser.publicId,
                      facebook_id: '',
                      firstName: '',
                      lastName: '',
                      pseudo: ''
                    });
                  }
                });
            }
          });
        }
        else {
          logger.info('Password too short');
          next(error.passwordTooShortError);
        }
      }
      else {
        logger.info('Invalid email address');
        next(error.invalidEmailError);
      }
    }
  }


});

router.put('', function (req, res, next) {

  logger.info('Receive an user update request');

  //Check user authenticated
  if (req.authType != 'user') {
    next(error.unauthorizedError);
  }
  else {

    //Check request
    if (req.body.facebookId == undefined
      || req.body.lastName == undefined
      || req.body.firstName == undefined) {
      next(error.invalidRequestError);
    }
    else {
      req.authUser.addFacebookData(req.body.facebookId,
        req.body.lastName, req.body.firstName, function (err) {
          if (err) {
            logger.error('Unable to update user ...');
            next(err.internalServerError);
          }
          else {
            logger.info('User updated (' + req.authUser.firstName + ')');
            res.status(200);
            res.send({
              email: req.authUser.email,
              public_id: req.authUser.publicId,
              facebook_id: req.authUser.facebookId,
              firstName: req.authUser.firstName,
              lastName: req.authUser.lastName,
              pseudo: req.authUser.pseudo
            });
          }

        });
    }
  }

});

module.exports = router;
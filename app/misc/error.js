
var notFoundError = {
  status : 404,
  message : 'Not Found'};

var unauthorizedError = {
  status : 401,
  message : 'Unauthorized request'};

var invalidRequestError = {
  status : 400,
  message : 'Invalid request'};

var passwordTooShortError = {
  status : 400,
  message : 'Password too short'};

var invalidEmailError = {
  status : 400,
  message : 'Invalid email address'};


var userAlreadyExistError = {
  status : 409,
  message : 'Email address already used'};

var userAlreadyFacebook = {
  status: 409,
  message: 'Facebook account already linked'};


var internalServerError = {
  status : 500,
  message : 'Internal server error'};


module.exports.unauthorizedError = unauthorizedError;
module.exports.notFoundError = notFoundError;
module.exports.invalidRequestError = invalidRequestError;
module.exports.passwordTooShortError = passwordTooShortError;
module.exports.internalServerError = internalServerError;
module.exports.userAlreadyExistError = userAlreadyExistError;
module.exports.invalidEmailError = invalidEmailError;
module.exports.userAlreadyFacebook = userAlreadyFacebook;
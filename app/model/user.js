var mongoose = require('mongoose');
var sha1 = require('sha1');

var userSchema = new mongoose.Schema({
  email: String,
  password: String,
  lastName: String,
  firstName: String,
  pseudo: String,
  registrationClient: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
  registrationDate: Date
});


userSchema.statics.createNewUser = function(email, password, lastName, firstName, pseudo, clientId, cb) {
  var now = new Date();

  userModel.create({
    email: email,
    password: sha1(password + email),
    lastName: lastName,
    firstName: firstName,
    pseudo: pseudo,
    registrationClient: clientId,
    registrationDate: now
  }, cb);
};

userSchema.statics.getUserByCredentials = function (email, password, cb) {
  var cryptedPassword = sha1(password + email);

  userModel.findOne({email: email, password: cryptedPassword}, '', cb);
};

userSchema.statics.getUserByEmail = function (email, cb) {
  userModel.findOne({email: email}, '_id', cb);
};

userSchema.statics.getUserById = function (userId, cb) {
  userModel.findOne({_id: userId}, cb);
};


var userModel = mongoose.model('User', userSchema);

module.exports = userModel;
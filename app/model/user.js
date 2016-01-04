var mongoose = require('mongoose');
var sha1 = require('sha1');

var userSchema = new mongoose.Schema({
  email: String,
  password: String,

  lastName: String,
  firstName: String,
  pseudo: String,

  registrationRequest: {type: mongoose.Schema.Types.ObjectId, ref: 'ClientRequest'},
  registrationDate: Date
});


userSchema.statics.createNewUser = function(email, password, requestId, cb) {
  var now = new Date();

  userModel.create({
    email: email,
    password: sha1(password + email),
    registrationRequest: requestId,
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
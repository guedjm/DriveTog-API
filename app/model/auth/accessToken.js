var mongoose = require('mongoose');

var accessTokenSchema = new mongoose.Schema({
  request: {type: mongoose.Schema.Types.ObjectId, ref: 'AuthAccessTokenRequest'},
  access: {type: mongoose.Schema.Types.ObjectId, ref: 'AuthAccess'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  token: String,
  usable: Boolean,
  deliveryDate: Date,
  expirationDate: Date
});

accessTokenSchema.statics.getToken = function (token, cb) {

  accessTokenModel.findOne({token: token, usable: true, expirationDate: {$gt: new Date()}}, 'user', cb);
};

var accessTokenModel = mongoose.model('AuthAccessToken', accessTokenSchema);

module.exports = accessTokenModel;

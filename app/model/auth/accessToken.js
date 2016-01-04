var mongoose = require('mongoose');

var accessTokenSchema = new mongoose.Schema({
  request: {type: mongoose.Schema.Types.ObjectId, ref: 'AuthAccessTokenRequest'},
  access: {type: mongoose.Schema.Types.ObjectId, ref: 'AuthAccess'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  client: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
  token: String,
  usable: Boolean,
  deliveryDate: Date,
  expirationDate: Date
});

accessTokenSchema.statics.getToken = function (token, cb) {


  var query = accessTokenModel.findOne({token: token, usable: true, expirationDate: {$gt: new Date()}});

  query.populate('client', '_id clientId clientType applicationName activated');
  query.populate('user');
  query.select('_id');
  query.exec(cb);
};

var accessTokenModel = mongoose.model('AuthAccessToken', accessTokenSchema);

module.exports = accessTokenModel;

'use strict';

var config = require('./config');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;

////////////////////////  USER /////////////////////////

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  displayName: String,
  picture: String,
  facebook: String,
  foursquare: String,
  google: String,
  github: String,
  linkedin: String,
  live: String,
  yahoo: String,
  twitter: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

var user = mongoose.model('User', userSchema);

exports.User = function () {
    return user;
}

////////////////////////  ITEM /////////////////////////

var itemSchema = new mongoose.Schema({
  _id: ObjectId,
  userId: ObjectId,
  text: { type: String },
  tags: { type: [String] },
  ts_cre: Date,
  ts_upd: Date,
});

var item = mongoose.model('Item', itemSchema);

itemSchema.index({ tags: 1, ts_cre: 1 });

exports.Item = function () {
    return item;
}

////////////////////////  TAG /////////////////////////

var tagSchema = new mongoose.Schema({
  name: { type: String },
  sharedWith: { type: [String] },
});

var tag = mongoose.model('tag', tagSchema);

exports.Tag = function () {
    return tag;
}



mongoose.connect(config.MONGO_URI);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

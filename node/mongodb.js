'use strict';

var config = require('./config');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;

var db = require('./mongodb');

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

var User = function () {
    return user;
}

////////////////////////  ITEM /////////////////////////

var itemSchema = new mongoose.Schema({
  _id: ObjectId,
  userId: ObjectId,
  text: { type: String },
  tags: { type: [String], index: true },
  ts_cre: Date,
  ts_upd: Date,
});

var item = mongoose.model('Item', itemSchema);

var Item = function () {
    return item;
}

var SearchNotes = function(id, keywords, tag) {
  var query = {
    userId:  mongoose.Types.ObjectId(id),
    $text : { $search : keywords }
  };
  if (tag) {
    query.tags = tag;
  }

  return  Item().find(query).exec();
}

var GetNotes = function(id, tag) {
  var query = {userId: mongoose.Types.ObjectId(id)};
  if (tag) {
    query.tags = tag;
  }
  return Item().find(query).sort({ts_upd: -1}).exec();
}

var GetTags = function(id) {
  return  Item().distinct('tags', { userId:  mongoose.Types.ObjectId(id) }).exec();
}

var SaveNote = function(doc) {
  var itemModel = Item();

  var note = new itemModel(doc);

  if (!note._doc._id) {
    note._doc._id = new mongoose.mongo.ObjectId();
  }
  var query = {"_id": note._doc._id };

  return itemModel.findOneAndUpdate(query, note, {upsert: true}).exec();
}

module.exports = {
  User: User,
  SearchNotes : SearchNotes,
  GetNotes : GetNotes,
  GetTags: GetTags,
  SaveNote: SaveNote
}

mongoose.connect(config.MONGO_URI);
var db = mongoose.connection;
db.on('error', function(err) {
  console.log(('Error: Could not connect to MongoDB. Did you forget to run `mongod` ?' + err).red);
});

db.once('open', function() {
    db.collections.items.createIndex({text: "text"}, function(err, res) {
      if (err)  console.log(err.red);
    });
});

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

var method = UserModel.prototype;
//user.find.bind(user);

function UserModel() {
}

method.findById =  function() {
//  user.find.bind(user);
  user.findById.apply(user, Array.prototype.slice.call(arguments));
}


method.findOne = function() {
//  user.find.bind(user);
  user.findOne.apply(user, Array.prototype.slice.call(arguments));
}

method.save = function(us, cb) {
  var u = new user(us);
  u.save(cb);
}

var User = function () {
    return UserModel;
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

var SearchNotes = function(id, keywords, tag, cb) {
  var query = {
    userId:  mongoose.Types.ObjectId(id),
    $text : { $search : keywords }
  };
  if (tag) {
    query.tags = tag;
  }

  return  Item().find(query).exec(cb);
}

var GetNotes = function(id, tag, cb) {
  var query = {userId: mongoose.Types.ObjectId(id)};
  if (tag) {
    query.tags = tag;
  }
  return Item().find(query).sort({ts_upd: -1}).exec(cb);
}

var GetTags = function(id, cb) {
  Item().distinct('tags', { userId:  mongoose.Types.ObjectId(id) }).exec(cb);
}

var SaveNote = function(doc, cb) {
  var itemModel = Item();

  var note = new itemModel(doc);

  if (!note._doc._id) {
    note._doc._id = new mongoose.mongo.ObjectId();
  }
  var query = {"_id": note._doc._id };

  itemModel.findOneAndUpdate(query, note, {upsert: true}).exec(cb);
}

module.exports = {
  User: UserModel,
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

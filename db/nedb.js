'use strict';

var config = require('../config');
var Datastore = require('nedb');
//var ObjectId = require('mongoose').Schema.Types.ObjectId;

////////////////////////  USER /////////////////////////

  var Users = new Datastore({filename: config.NEDB_USER_FILE, autoload: true});

  var method = User.prototype;

  function User() {
  }

  method.findOne = function(query, cb) {
    Users.find(query, function(err, docs) {
      if (err) {
        cb(err)
      } else {
        if (docs.length != 1)
        {
          cb(null, null);
        } else {
          var user = new User();
          var doc = docs[0];
          for(var k in doc) user[k] = doc[k];
          cb(err, user);
        }
      }
    });
  }

  method.findById = function(id, cb) {
    this.findOne({_id: id}, cb);
  }

  method.save = function(user, cb) {
    if (!user._id) {
      Users.insert(user, cb);
    } else {
      Users.update({_id: user._id },
        {$set: user},
        {}, cb);
    }
  }

function NewUser() { return new User(); }

////////////////////////  ITEM /////////////////////////

var Notes = new Datastore({filename: config.NEDB_NOTES_FILE, autoload: true});

var GetNotes = function(id, tag, cb) {
  var query = {userId: id};
  if (tag) {
    query.tags = tag;
  }
  Notes.find(query).sort({ts_upd : -1}).exec(cb);
}

var SearchNotes = function(id, keywords, tag, cb) {
//  GetNotes(id, tag, function(err, doc) {
var query = {userId: id};
if (tag) {
  query.tags = tag;
}
Notes.find(query).sort({ts_upd : -1}).exec(function(err, doc) {
    if (err) {
      cb(err);
      return;
    } else {
      var keys = keywords.split(' ');
       var filtered = doc.filter(function (d) {
         var found = false;
         keys.some(function(k) {
            if (d.text.search(k) != -1) {
              found = true;
              return true;
            }
         });
         return found;
      });
      cb(null, filtered);
    }
  });
}

var GetTags = function(id, cb) {
  Notes.find({userId:  id}, {tags: 1, _id: 0}, function(err, doc) {
    if (err) {
      cb(err);
    } else {
      var arr = [];
      doc.forEach(function(item) {
        arr = arr.concat(item.tags);
      });

      var unique = arr.sort().filter(function(item, pos, ary) {
         return !pos || item != ary[pos - 1];
      });

      cb(null, unique);
   }
 });
}

var SaveNote = function(note, cb) {
  if (!note._id) {
    Notes.insert(note, cb);
  } else {
    // var id = note._id;
    // note.remove
    Notes.update({_id: note._id },
      {$set: {text: note.text, tags: note.tags}},
      {}, cb);
  }
}

module.exports = {
  SearchNotes : SearchNotes,
  GetNotes : GetNotes,
  GetTags: GetTags,
  SaveNote: SaveNote,
  User: NewUser
}

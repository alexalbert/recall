var db = require('./mongodb');
var ObjectId = require('mongoose').Types.ObjectId;
var mongoose = require('mongoose');

exports.init = function (expapp) {
  if (!expapp) {
    throw new Error('App is required');
  }
  var app = expapp;

  // app.get('/auth/me', ensureAuthenticated, function(req, res) {
  app.get('/api/searchNotes', function(req, res) {
    var id = new ObjectId(req.query.user);
    var keywords = req.query.keywords;
    var query = {
      userId: id,
      $text : { $search : keywords }
    };
    var tag = req.query.tag;
    if (tag) {
      query.tags = tag;
    }
    db.Item().find(query).exec(function(err, user) {
      res.send(user);
    });
  });

  app.get('/api/getNotes', function(req, res) {
    var id = new ObjectId(req.query.user);
    var query = {userId: id};
    var tag = req.query.tag;
    if (tag) {
      query.tags = tag;
    }
    db.Item().find(query).sort({ts_upd: -1}).exec(function(err, user) {
      res.send(user);
    });
  });

  app.get('/api/getTags', function(req, res) {
   var id = new ObjectId(req.query.user);
    db.Item().distinct( 'tags', {
      userId: id
    }).exec(function(err, user) {
      res.send(user);
    });
  });

  app.post('/api/saveNote', function(req, res) {
    console.log(req.body);
    var itemModel = db.Item();

    var item = new itemModel(req.body);
    console.log("recieved id " + item._doc._id);
    if (!item._doc._id) {
      console.log("creating id!!!")
      item._doc._id = new mongoose.mongo.ObjectId();
    }
    var query = {"_id": item._doc._id };

    itemModel.findOneAndUpdate(query, item, {upsert: true}, function(err) {
        if (err) {
          res.send('Error ' + err);
        }
        else {
            console.log("getting back id " + item._doc._id);
          res.send(item._doc._id);
        }
    });
  });
}

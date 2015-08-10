var ObjectId = require('mongoose').Types.ObjectId;

exports.init = function (expapp) {

  var db = require('./mongodb');

  if (!expapp) {
    throw new Error('App is required');
  }
  var app = expapp;

  // app.get('/auth/me', ensureAuthenticated, function(req, res) {
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
    var query = {"_id": req.body._id };

    itemModel.findOneAndUpdate(query, item, {upsert: true}, function(err) {
        if (err) {
          res.send('Error ' + err);
        }
        else {
          res.sendStatus(200);
        }
    });
  });
}

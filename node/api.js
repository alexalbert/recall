var config = require('./config');
var db = config.DB === 'nedb' ? require('./nedb') : require('./mongodb');

exports.init = function (expapp) {
  if (!expapp) {
    throw new Error('App is required');
  }
  var app = expapp;

  app.get('/api/searchNotes', function(req, res) {
    var id = req.query.user;
    var keywords = req.query.keywords;
    var tag = req.query.tag;
    db.SearchNotes(id, keywords, tag, function(err, doc) {
      res.send(doc);
    });
  });

  app.get('/api/getNotes', function(req, res) {
    var id = req.query.user;
    var tag = req.query.tag;
    db.GetNotes(id, tag, function(err, doc) {
      res.send(doc);
    });
  });

  app.get('/api/getTags', function(req, res) {
   var id = req.query.user;
   db.GetTags(id, function(err, doc) {
     res.send(doc);
   });
  });

  app.post('/api/saveNote', function(req, res) {
    db.SaveNote(req.body, function(err, doc) {

      res.send(req.body._id || doc._id);
    });
  });
}

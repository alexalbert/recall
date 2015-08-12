var db = require('./mongodb');

exports.init = function (expapp) {
  if (!expapp) {
    throw new Error('App is required');
  }
  var app = expapp;

  app.get('/api/searchNotes', function(req, res) {
    var id = query.user;
    var keywords = req.query.keywords;
    var tag = req.query.tag;
    db.SearchNotes(id, keywords, tag)
    .then(function(doc) {
      res.send(doc);
    }, function(err) {
      console.log(err);
    });
  });

  app.get('/api/getNotes', function(req, res) {
    var id = req.query.user;
    var tag = req.query.tag;
    db.GetNotes(id, tag)
    .then(function(doc) {
      res.send(doc);
    }, function(err) {
      console.log(err);
    });
  });

  app.get('/api/getTags', function(req, res) {
   var id = req.query.user;
   db.GetTags(id)
   .then(function(doc) {
     res.send(doc);
   }, function(err) {
     console.log(err);
   });
  });

  app.post('/api/saveNote', function(req, res) {
    db.SaveNote(req.body)
    .then(function(doc) {
      res.send(doc._id);
     }, function(err) {
      console.log(err);
     });
  });
}

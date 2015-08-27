'use strict';

// UNFINISHED

var config = require('../config');
var gcloud = require('gcloud');

// [START config]
var ds = gcloud.datastore.dataset(config.gcloud);
var USERS = 'Users';
var NOTES = 'Notes';
var TAGS = 'Tags';
// [END config]


/*
  Translates from Datastore's entity format to
  the format expected by the application.

  Datastore format:
    {
      key: [kind, id],
      data: {
        property: value
      }
    }

  Application format:
    {
      id: id,
      property: value
    }
*/
function fromDatastore(obj) {
  obj.data.id = obj.key.path[obj.key.path.length - 1];
  return obj.data;
}


/*
  Translates from the application's format to the datastore's
  extended entity property format. It also handles marking any
  specified properties as non-indexed. Does not translate the key.

  Application format:
    {
      id: id,
      property: value,
      unindexedProperty: value
    }

  Datastore extended format:
    [
      {
        name: property,
        value: value
      },
      {
        name: unindexedProperty,
        value: value,
        excludeFromIndexes: true
      }
    ]
*/
function toDatastore(obj, nonIndexed) {
  nonIndexed = nonIndexed || [];
  var results = [];
  Object.keys(obj).forEach(function(k) {
    if (obj[k] === undefined) return;
    results.push({
      name: k,
      value: obj[k],
      excludeFromIndexes: nonIndexed.indexOf(k) !== -1
    });
  });
  return results;
}


  var method = User.prototype;

  function User() {
  }

  method.findOne = function(query, cb) {
    var f = [];
    var order = [{ property: { name: 'ts_upd', direction: 'DESCENDING' } }];

    var index = 1;
    Object.keys(query).forEach(function(k) {
      var tag = 'filter' + index;
      f.push({ tag: {property: {name: k}, operator: 'EQUAL', value: {stringValue: query[k]}}});
      index++;
    })

    var ff = {filter: {compositeFilter: { operator: 'AND', filters: f }}};

//    var q = {kinds: [{name: USERS }], filter: filter, order: order};
    var q = {kinds: [{name: USERS }], filters: ff, selectVal: []};

    ds.runQuery(q, function(err, data) {
        if (err) return cb(err);
        cb(null, data);
    });
  }

  method.findById = function(id, cb) {
    this.findOne({_id: id}, cb);
  }

  method.save = function(user, cb) {
    var key;
    if (data._id) {
      key = ds.key([USERS, data._id]);
    } else {
      key = ds.key(USERS);
    }

    var entity = {
      key: key,
      data: toDatastore(data, ['ts_cre'])
    };

    ds.commit({
      mutation: {upsert: [entity]},
      mode: 'NON_TRANSACTIONAL'
    }).execute(cb);
  }

  method._delete = function (id, cb) {
    var key = ds.key([USERS, id]);
    ds.delete(key, cb);
  }

function NewUser() { return new User(); }

module.exports = {
  User: NewUser
}

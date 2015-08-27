'use strict';

// Stopgap implementation, highly inefficient.

var config = require('../config');
var bcrypt = require('bcryptjs');
var AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: config.DYNAMODB_ACCESSKYEID,
  secretAccessKey: config.DYNAMODB_SECRETACCESKEY,
  dynamoDbCrc32: false,
  region: config.DYNAMODB_REGION
});
var dynamodb = new AWS.DynamoDB({
  endpoint: new AWS.Endpoint(config.DYNAMODB_ENDPOINT)
});

////////////  CREATE TABLES /////////////////
function createTable(params) {
  dynamodb.createTable(params, function(err, data) {
    if (err)
      console.log(JSON.stringify(err, null, 2));
    else
      console.log(JSON.stringify(data, null, 2));
  });
}

function createTableUser() {
  var params = {
    TableName: "User",
    KeySchema: [{
      AttributeName: "_id",
      KeyType: "HASH",
    }],
    AttributeDefinitions: [{
      AttributeName: "_id",
      AttributeType: "S"
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  };

  createTable(params);
}


function createTableNotes() {
  var params = {
    TableName: "Notes",
    KeySchema: [{
      AttributeName: "userId",
      KeyType: "HASH"
    }, {
      AttributeName: "ts_cre",
      KeyType: "RANGE"
    }],
    AttributeDefinitions: [{
      AttributeName: "userId",
      AttributeType: "S"
    }, {
      AttributeName: "ts_cre",
      AttributeType: "S"
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  };
  createTable(params);
}

function createAllTables() {
  dynamodb.listTables({}, function(err, data) {
    if (err) console.log(err, err.stack);
    else {
      console.log(data);
      if (data.TableNames.indexOf('User') === -1) {
        createTableUser();
      }
      if (data.TableNames.indexOf('Notes') === -1) {
        createTableNotes();
      }
    }
  });
}
createAllTables();

////////////  UTILITIES /////////////////
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function wrap(item) {
  var wrapped = {};
  var keys = Object.keys(item);

  keys.forEach(function(k) {
    var type;
    switch (k) {
      case 'tags':
        type = 'SS';
        break;
      default:
        type = 'S';
    }
    wrapped[k] = {};
    wrapped[k][type] = item[k];
  });
  return wrapped;
}

function unwrap(item) {
  var keys = Object.keys(item);
  var unwrapped = {};
  keys.forEach(function(k) {
    unwrapped[k] = item[k]['S'] ? item[k]['S'] :
      item[k]['N'] ? item[k]['N'] :
      item[k]['SS'];
  })
  return unwrapped;
}

////////////  USER /////////////////
var method = User.prototype;

function User() {}

function NewUser() {
  return new User();
}


function _save(user, cb) {
  if (!user._id) {
    user._id = guid();
  }

  var item = wrap(user);

  var params = {
    TableName: "User",
    Item: item
  };

  dynamodb.putItem(params, function(err, data) {
    if (err) console.log('save ' + err);
    cb(null, data);
  });
}

method.save = function(user, cb) {
  if (!user._id && user.password) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        _save(user, cb);
      });
    });
  }
}

method.findOne = function(query, cb) {
  var params = {
    TableName: "User"
  };
  // console.log("===================query " + JSON.stringify(query, null, 2));
  // console.log("CB " + cb);
  // console.log("CB " + JSON.stringify(cb, null, 2));

  dynamodb.scan(params, function(err, data) {
    if (err) {
//      console.log("User.findOne " + JSON.stringify(err, null, 2));
      cb(err);
    } else {
      var keys = Object.keys(query);
      // console.log("User.findOne data " + JSON.stringify(data, null, 2));

      var match = null;
      if (data.Items) {
        match = data.Items.filter(function(item) {
          return keys.every(function(k) {
            return item[k] && item[k]['S'] === query[k];
          });
        });
      }
      if (match === null || match.length == 0) cb(null, null);
      else {
        var unw = unwrap(match[0])
         console.log("MATCH " + JSON.stringify(unw, null, 2));
        // console.log("CB " + cb);
        cb(null, unw);
      }
    }
  });
}

method.findById = function(id, cb) {
  console.log("ID =  " + id);
  this.findOne({
    "_id": id
  }, cb)
}


method.comparePassword = function(password, dbPassword, done) {
  console.log(password + "  === " + dbPassword);
bcrypt.compare(password, dbPassword, function(err, isMatch) {
  done(err, isMatch);
});
};

///////////  NOTES //////////////////////
var GetNotes = function(id, tag, cb) {
  console.log("id " + JSON.stringify(id, null, 2));
  console.log("tag " + JSON.stringify(tag, null, 2));
  console.log("cb " + cb);
  var params = {
    TableName: "Notes",
    KeyConditions: {
      "userId": {
        AttributeValueList: [{
          "S": id
        }],
        ComparisonOperator: "EQ"
      },
      "ts_cre": {
        AttributeValueList: [{
          "S": '   '
        }],
        ComparisonOperator: "GT"
      },
    }
  };
  dynamodb.query(params, function(err, data) {
    if (err) {
//      console.log("GetNotes " + JSON.stringify(err, null, 2));
      cb(err);
    } else {
        // console.log("GetNotes " + JSON.stringify(data, null, 2));
        if (data.Count > 0) {
        var res = data.Items.map(function(d) {
          return unwrap(d);
        });

        if (tag) {
          res = res.filter(function(d) {
            return d.tags.indexOf(tag) != -1;
          });
        }
        cb(null, res);
      } else {
        cb(null, null);
      }
    }
  });
}


var SearchNotes = function(id, keywords, tag, cb) {
  GetNotes(id, tag, function(err, data) {
    if (err) {
      cb(err);
      return;
    } else {
      var keys = keywords.split(' ');
      var filtered = data.filter(function(d) {
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
    GetNotes(id, null, function(err, data) {
        if (err) {
          cb(err);
        } else {
            if (!data) cb(null, null);
            else {
              var arr = [];
              data.forEach(function(item) {
                arr = arr.concat(item.tags);
              });

              var unique = arr.sort().filter(function(item, pos, ary) {
                return !pos || item != ary[pos - 1];
              });

              cb(null, unique);
            }
          }
        });
    }

    var SaveNote = function(note, cb) {
      if (!note._id) note._id = guid();

      if (!note.tags.length) delete note.tags;

      var wrapped = wrap(note);
      var params = {
        TableName: "Notes",
        Item: wrapped
      };
      console.log("SaveNote " + JSON.stringify(params, null, 2));
      dynamodb.putItem(params, function(err, data) {
        if (err) {
          console.log("SaveNote " + JSON.stringify(err, null, 2));
          cb(err);
        } else {
          console.log("SaveNote " + JSON.stringify(data, null, 2));
          cb(null, data);
        }});
    }

    module.exports = {
      SearchNotes: SearchNotes,
      GetNotes: GetNotes,
      GetTags: GetTags,
      SaveNote: SaveNote,
      User: NewUser
    }

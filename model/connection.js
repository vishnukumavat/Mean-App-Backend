const assert = require("assert");
const client = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "analytics";

let _db;
module.exports = {
  getDb,
  initDb,
};

function initDb(callback) {
  if (_db) {
    console.warn("Trying to init DB again!");
    return callback(null, _db);
  }
  client.connect(
    url,
    { useUnifiedTopology: true, useNewUrlParser: true },
    connected
  );
  function connected(err, client) {
    if (err) {
      return callback(err);
    }
    console.log("DB initialized - connected to: " + url);
    _db = client.db(dbName);
    return callback(null, _db);
  }
}

function getDb() {
  assert.ok(_db, "Db has not been initialized. Please call initDb first.");
  return _db;
}

const getDB = require("./connection").getDb;

class DataBaseOperations {
  constructor() {
    this.db = getDB();
  }

  createCollection(collectionName) {
    this.db.createCollection(collectionName, function (err, res) {
      if (err) throw err;
      console.log("Collection created successfully!");
    });
  }

  insertDocument(collectionName, documentObject) {
    // documentObject = { name: "Company Inc", address: "Highway 37" };
    return this.db.collection(collectionName).insertOne(documentObject);
  }

  getAllDocument(collectionName) {
    return this.db.collection(collectionName).find({}).toArray();
  }

  getDocumentByQuery(collectionName, query) {
    // query = { address: "Park Lane 38" };
    return this.db.collection(collectionName).find(query).toArray();
  }

  getDocumentSorted(collectionName, sortBy) {
    // sortBy = { name: 1 }; => 1:ascending & -1:descending
    return this.db.collection(collectionName).find().sort(sortBy).toArray();
  }

  deleteOneDocument(collectionName, query) {
    // query = { address: 'Mountain 21' };
    this.db.collection(collectionName).deleteOne(query);
  }

  deleteManyDocument(collectionName, query) {
    // var query = { address: /^O/ }; Delete all documents were the address starts with the letter "O"
    this.db.collection(collectionName).deleteMany(query);
  }

  updateDocument(collectionName, query, newvalues) {
    // query = { address: "Valley 345" };
    // newvalues = { $set: { name: "Mickey", address: "Canyon 123" } };
    this.db.collection(collectionName).updateOne(query, newvalues);
  }

  aggregatedDocumentResult(collectionName, groupByKey) {
    //return format : [{ "about_page": 1, "home_page": 1, "contact_page": 1, "home": 1, "": 2, "introduction_page": 1, "analytics_dashboard_page": 1 }]
    return this.db
      .collection(collectionName)
      .aggregate([
        {
          $group: {
            _id: { $toLower: "$" + groupByKey },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            counts: {
              $push: { k: "$_id", v: "$count" },
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: { $arrayToObject: "$counts" },
          },
        },
      ])
      .toArray();
  }
}

exports.DataBaseOperations = DataBaseOperations;

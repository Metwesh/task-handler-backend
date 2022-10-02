const { MongoClient, ServerApiVersion } = require("mongodb");

const mongoClient = new MongoClient(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

var db;

module.exports = {
  connectToServer: async function (callback) {
    mongoClient.connect(function (err, Db) {
      if (!Db) {
        return callback(err);
      } else {
        console.log("Successfully connected to Task Handler DB.");
        return (db = Db.db("taskhandler"));
      }
    });
  },

  getDb: function () {
    return db;
  },
};

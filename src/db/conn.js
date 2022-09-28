const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

let _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect((err) => {
      _db = client.db("taskhandler");
      console.log("Successfully connected to Task Handler DB.");
      if (err) return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};

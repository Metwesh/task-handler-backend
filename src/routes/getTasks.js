const express = require("express");

const recordRoutes = express.Router();

const dbo = require("../db/conn");

// This section will help you get a list of all the records.
recordRoutes.route("/getalltasks").get(function (_req, res) {
  let db_connect = dbo.getDb("taskhandler");
  db_connect
    .collection("tasks")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

recordRoutes.route("/getusertasks/:name").get(function (req, res) {
  let db_connect = dbo.getDb("taskhandler");
  db_connect
    .collection("tasks")
    .find({ employeeNames: req.params.name })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

module.exports = recordRoutes;

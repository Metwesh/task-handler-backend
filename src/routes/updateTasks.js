const express = require("express");
const { ObjectId } = require("mongodb");

const recordRoutes = express.Router();

const dbo = require("../db/conn");

recordRoutes.route("/updatependingtasks").post(async function (req, response) {
  let db_connect = dbo.getDb("taskhandler");
  const id = req.body;
  const idMap = id.map((id) => {
    return ObjectId(id);
  });

  await db_connect
    .collection("tasks")
    .updateMany(
      { _id: { $in: idMap } },
      { $set: { status: "Pending" } },
      function (err, res) {
        if (err) throw err;
        console.log(res);
        response.json(res);
      }
    );
});

recordRoutes.route("/updatecompletetasks").post(async function (req, response) {
  let db_connect = dbo.getDb("taskhandler");
  const id = req.body;
  const idMap = id.map((id) => {
    return ObjectId(id);
  });

  await db_connect
    .collection("tasks")
    .updateMany(
      { _id: { $in: idMap } },
      { $set: { status: "Complete" } },
      function (err, res) {
        if (err) throw err;
        response.json(res);
      }
    );
});

recordRoutes.route("/updatedeletetasks").post(async function (req, response) {
  let db_connect = dbo.getDb("taskhandler");
  const id = req.body;
  const idMap = id.map((id) => {
    return ObjectId(id);
  });

  await db_connect
    .collection("tasks")
    .deleteMany({ _id: { $in: idMap } }, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
});

module.exports = recordRoutes;

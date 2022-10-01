const express = require("express");

const recordRoutes = express.Router();

const dbo = require("../db/conn");

// This section will help you get a list of all the users regardless of role.
recordRoutes.route("/getallusers").get(async function (_req, res) {
  let db_connect = dbo.getDb("taskhandler");
  await db_connect
    .collection("users")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help get a list of users with a role of user.
recordRoutes.route("/getusers").get(async function (_req, res) {
  let db_connect = dbo.getDb("taskhandler");
  await db_connect
    .collection("users")
    .find({ role: "User" })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help get a list of admins
recordRoutes.route("/getadmins").get(async function (_req, res) {
  let db_connect = dbo.getDb("taskhandler");
  await db_connect
    .collection("users")
    .find({ role: "Admin" })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

module.exports = recordRoutes;

const express = require("express");

const recordRoutes = express.Router();

const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/privileges/:id").post(async function (req, response) {
  let db_connect = dbo.getDb("taskhandler");
  let myquery = { _id: ObjectId(req.params.id) };

  if (req.body.activeEmpRole !== "Admin") return;

  await db_connect
    .collection("users")
    .updateOne(myquery, { $set: { role: req.body.role } }, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = recordRoutes;

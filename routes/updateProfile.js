const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const recordRoutes = express.Router();

const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/updateuser/:id").post(async function (req, response) {
  let db_connect = dbo.getDb("taskhandler");
  let myquery = { _id: ObjectId(req.params.id) };
  let newValues = {};
  if (Object.keys(req.body).length === 0) return;

  await checkOldPassword(db_connect, myquery, req, response);
  if (!checkOldPassword) return;

  checkValues(req, newValues);
  if (!checkValues) return;

  await hashNewPassword(req, newValues);

  let formattedValues = { $set: newValues };
  await db_connect
    .collection("users")
    .updateOne(myquery, formattedValues, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
});

////////////////////////////////////

async function checkOldPassword(db_connect, myquery, req, response) {
  await db_connect
    .collection("users")
    .findOne(myquery, async function (error, res) {
      if (error) throw error;
      await bcrypt
        .compare(req.body.oldPassword, res?.password)
        .then(function (result) {
          if (!result) {
            response.status(401);
            return false;
          }
        });
    });
}

function checkValues(req, newValues) {
  if (
    !req.body.hasOwnProperty("name") ||
    !req.body.hasOwnProperty("email") ||
    !req.body.hasOwnProperty("newPassword")
  )
    return false;
  if (req.body.hasOwnProperty("name")) newValues["name"] = `${req.body.name}`;
  if (req.body.hasOwnProperty("email"))
    newValues["email"] = `${req.body.email}`;
  if (req.body.hasOwnProperty("newPassword"))
    newValues["password"] = `${req.body.newPassword}`;
}

async function hashNewPassword(req, newValues) {
  req.body.hasOwnProperty("newPassword") &&
    (await bcrypt
      .hash(newValues?.newPassword, saltRounds)
      .then(function (hash) {
        newValues.newPassword = hash;
      }));
}

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

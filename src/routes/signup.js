const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const recordRoutes = express.Router();

const dbo = require("../db/conn");

recordRoutes.route("/signup").post(async function (req, res) {
  let { name, email, password, role } = req.body;

  await bcrypt.hash(password, saltRounds).then(function (hash) {
    password = hash;
  });
  let user = {
    name: name,
    email: email,
    password: password,
    role: role,
  };
  await dbo
    .getDb("taskhandler")
    .collection("users")
    .insertOne(user, function (error, result) {
      if (error) throw error;
      if (result.acknowledged === true) {
        let userToken = { email: email, password: password };
        const accessToken = generateAccessToken(userToken);
        const refreshToken = generateRefreshToken(userToken);
        res.status(200).json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: result.insertedId,
          password: password,
        });
      }
    });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60m" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = recordRoutes;

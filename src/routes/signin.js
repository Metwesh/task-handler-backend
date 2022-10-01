const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const recordRoutes = express.Router();

const dbo = require("../db/conn");

recordRoutes.route("/signin").post(async function (req, res) {
  let { email, password } = req.body;

  await dbo
    .getDb("taskhandler")
    .collection("users")
    .findOne({ email: email }, async function (error, response) {
      if (error) throw error;
      if (!response) {
        res.status(401).json({ message: "Invalid Email" });
        return;
      }
      await bcrypt
        .compare(password, response?.password)
        .then(function (result) {
          if (!result) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
          }
          let userToken = { email: email, password: response?.password };
          const accessToken = generateAccessToken(userToken);
          const refreshToken = generateRefreshToken(userToken);
          res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            password: response?.password,
          });
        });
    });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60m" });
}
// jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function(err, token) {
//   console.log(token);
// });

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = recordRoutes;

const express = require("express");

const recordRoutes = express.Router();

const jwt = require("jsonwebtoken");

const dbo = require("../db/conn");

recordRoutes.route("/addtask").post(async function (request, response) {
  let db_connect = dbo.getDb("taskhandler");
  let {
    task,
    adminEmail,
    adminRole,
    adminName,
    startDate,
    deadline,
    employeeEmails,
    employeeNames,
    status,
  } = request.body;

  let data = {
    task: task,
    adminEmail: adminEmail,
    adminName: adminName,
    startDate: new Date(startDate),
    deadline: new Date(deadline),
    employeeEmails: employeeEmails,
    employeeNames: employeeNames,
    status: status,
  };

  if (adminRole !== "Admin") response.status(401);

  await db_connect
    .collection("tasks")
    .insertOne(data, function (error, result) {
      if (error) throw error;
      response.json(result);
    });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = recordRoutes;

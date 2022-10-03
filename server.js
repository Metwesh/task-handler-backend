const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");

const { createClient } = require("redis");

require("dotenv").config({ path: "./.env" });

// Development
const corsOptions = "";

// Production
// const corsOptions = {
//   origin: "https://task-handler-v2.herokuapp.com",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const redisClient = createClient({ url: process.env.REDIS_URI });

app.use(require("./src/routes/getUsers"));
app.use(require("./src/routes/signin"));
app.use(require("./src/routes/signup"));
app.use(require("./src/routes/updateProfile"));
app.use(require("./src/routes/updatePrivileges"));
app.use(require("./src/routes/addTasks"));
app.use(require("./src/routes/getTasks"));
app.use(require("./src/routes/updateTasks"));

const dbo = require("./src/db/conn");

app.listen(process.env.PORT || 3001, async () => {
  console.log(`Server is running on port: ${process.env.PORT || 3001}`);
  redisClient
    .on("connect", () => console.log("Connected to Redis"))
    .on("error", (err) => console.log("Redis Client Error", err));

  await redisClient.connect();

  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
});

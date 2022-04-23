const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config({ path: "./config.env" });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(require("./src/routes/getUsers"));
app.use(require("./src/routes/signin"));
app.use(require("./src/routes/signup"));
app.use(require("./src/routes/updateProfile"));
app.use(require("./src/routes/updatePrivileges"));
app.use(require("./src/routes/addTasks"));
app.use(require("./src/routes/getTasks"));
app.use(require("./src/routes/updateTasks"));

const dbo = require("./src/db/conn");

app.listen(process.env.PORT || 3001, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${process.env.PORT || 3001}`);
});

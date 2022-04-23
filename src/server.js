const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config({ path: "./config.env" });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (_req, res) => res.send("sucess"));
app.use(require("./routes/getUsers"));
app.use(require("./routes/signin"));
app.use(require("./routes/signup"));
app.use(require("./routes/updateProfile"));
app.use(require("./routes/updatePrivileges"));
app.use(require("./routes/addTasks"));
app.use(require("./routes/getTasks"));
app.use(require("./routes/updateTasks"));

const dbo = require("./db/conn");

app.listen(process.env.PORT || 3001, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${process.env.PORT || 3001}`);
});

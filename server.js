const express = require("express");
const PORT = process.env.port || 3000;
const app = express();
const db = require("./src/models/index");
const userRouter = require("./src/routes/userRoute");
const songRouter = require("./src/routes/songRoute");

app.listen(PORT, () => {
  console.log(`Server is listening to port : ${PORT}`);
});
db.sequelize.sync();
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);
app.use("/song", songRouter);
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

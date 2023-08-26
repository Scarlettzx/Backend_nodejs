const dotenv = require('dotenv');
dotenv.config({path: ".env"})
const myDateModule = require('./util/date');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// !middleware passing Json => Obj
console.log(myDateModule.getCurrentDateTimeFormatted());
app.use("/api/users", userRouter);
// app.use("/api/posts")
// const userRouter = require("./user");
// app.use("/users", userRouter);
app.listen(process.env.APP_PORT, () => {
  console.log(`server is running on port ${process.env.APP_PORT}`);
});

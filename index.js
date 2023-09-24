const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const myDateModule = require("./util/date");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const roleRouter = require("./routes/role");
const commentRouter = require("./routes/comment");
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// !middleware passing Json => Obj
console.log(myDateModule.getCurrentDateTimeFormatted());
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/roles", roleRouter);
app.use("/api/comments", commentRouter);
// app.use("/api/posts")ฏ
// const userRouter = require("./user");
// app.use("/users", userRouter);
app.listen(process.env.APP_PORT, () => {
  console.log(`server is running on port ${process.env.APP_PORT}`);
});

// const express = require("express");
// const router = express.Router();
// var db = require("./config/db");
// router.route("/register").post((req, res) => {
//   // ! get params
//   var username = req.body.username;
//   var email = req.body.email;
//   var password = req.body.password;
//   var confirmpassword = req.body.confirmpassword;

//   var sqlQuery =
//     "INSERT INTO user(username,email,password,confirmpassword) VALUES (?,?,?,?)";

//   // ! call database to insert so add or include database
//   db.query(
//     sqlQuery,
//     [   username, email, password, confirmpassword],
//     function (error, data, fields) {
//       if (error) {
//         res.status(400).send(JSON.stringify({ success: false, message: error }));
//       } else res.status(201).send(JSON.stringify({ success: true, message: "register" }));
//     }
//   );
// });

// module.exports = router;

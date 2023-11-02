const {
    createadmin,
    getUserByUserEmail,
  } = require("../service/user");
  const fs = require("fs");
  const { genSaltSync, hashSync, compareSync } = require("bcrypt");
  const { sign } = require("jsonwebtoken");
  const myDateModule = require("../util/date");
  module.exports = {
    // ! create User
    createUser: (req, res) => {
      const body = req.body;
      // ! import Utils from /util/date by using moment into format datetime
      // ?  Check to see if there are duplicate emails in the database. If so, return message email is already
      const createAt = myDateModule.getCurrentDateTimeFormatted();
      const updateAt = myDateModule.getCurrentDateTimeFormatted();
      getUserByUserEmail(body.email, (err, results) => {
        console.log(body);
        console.log(req.file);
        try {
          // ! results == false not have email in DB
          if (!results) {
            //? ตรวจสอบว่ามีไฟล์รูปภาพถูกอัปโหลดหรือไม่
            if (!req.file) {
              console.log(req.file);
              // เราสามารถส่งข้อความแสดงข้อผิดพลาดไปยังไคลเอนต์ได้ที่นี่
              return res.status(400).json({
                success: 0,
                message: "Image upload is required",
              });
            }
            body.avatar = req.file.filename;
            console.log(body);
            // ! generate salt by using brycpt  combine with password user
            const salt = genSaltSync(10);
            body.password = hashSync(body.password, salt);
            // ! passing body from user and parameters createAt, updateAt into create goto service {user}
            createadmin(body, createAt, updateAt, (err, results) => {
              if (err) {
                console.log(err);
                fs.unlinkSync(req.file.path);
                return res.status(500).json({
                  success: 0,
                  message: "Database connection error",
                });
              }
              console.log(results);
              return res.status(200).json({
                success: 1,
                data: body,
              });
            });
          } else {
            fs.unlinkSync(req.file.path);
            return res.status(409).json({
              success: 0,
              data: "email is already",
            });
          }
        } catch {
          console.log(err);
        }
      });
    },
    login: (req, res) => {
      const body = req.body;
      getUserByUserEmail(body.email, (err, results) => {
        try {
          if (err) {
            console.log(err);
          }
          if (!results) {
            return res.status(401).json({
              success: 0,
              data: "Invalid email or password",
            });
          }
          const result = compareSync(body.password, results.user_password);
          if (result) {
            results.user_password = undefined;
            const jsontoken = sign({ result: results }, "qwe1234", {
              expiresIn: "1h",
            });
            return res.status(200).json({
              success: 1,
              data: "login successfully",
              token: jsontoken,
            });
          } else {
            return res.status(401).json({
              success: 0,
              data: "Invalid email or password",
            });
          }
        } catch (e) {
          console.log(e);
        }
      });
    },
  };
  
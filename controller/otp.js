// var CryptoJS = require("crypto-js");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { getUserByUserEmail } = require("../service/user");
const { createOtp, DeleteotpAll } = require("../service/otp");
const myDateModule = require("../util/date");
const { randomInt } = require("crypto");
function sendVerificationEmail(email, verificationCode) {
  // ในส่วนนี้คุณควรใช้ไลบรารีหรือโมดูลที่เหมาะสมในการส่งอีเมล
  // เพื่อสร้างอีเมลยืนยันและส่งไปยังอีเมลของผู้ใช้
  // ตัวอย่างโค้ดนี้ใช้ nodemailer สำหรับการส่งอีเมล (ควรติดตั้ง nodemailer ก่อนใช้)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "scarlettz.mew@gmail.com", // your email
      pass: "weyikaslwumevykt", // your password
    },
  });

  const mailOptions = {
    from: "scarlettz.mew@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Your OTP : ${verificationCode}`,
    html: `<p style="color: blue;">Your OTP : ${verificationCode}</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error sending verification email: " + error);
    } else {
      console.log("Verification email sent: " + info.response);
    }
  });
}
module.exports = {
  createOtp: (req, res, next) => {
    const body = req.body;
    getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
        // fs.unlinkSync(req.file.path);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      if (!results) {
        DeleteotpAll(body.email, (err, deleteResults) => {
          if (err) {
            console.log(err);
            // fs.unlinkSync(req.file.path);
            return res.status(500).json({
              success: 0,
              message: "Database connection error",
            });
          }
          const verificationCode = randomInt(100000, 999999).toString();
          console.log(`Verification code: ${verificationCode}`);
          const createAt = myDateModule.getCurrentDateTimeFormatted();
          const expiresAt = new Date();
          expiresAt.setMinutes(expiresAt.getMinutes() + 30); // ตั้งเวลาหมดอายุใน 30 นาที
          createOtp(
            body.email,
            verificationCode,
            createAt,
            expiresAt,
            async (err, createOtpResults) => {
              if (err) {
                console.log(err);
                //   fs.unlinkSync(req.file.path);
                return res.status(500).json({
                  success: 0,
                  message: "Database connection error",
                });
              } else {
                sendVerificationEmail(body.email, verificationCode);
                // ดำเนินการเพิ่มรายการลงทะเบียนเสร็จสมบูรณ์
                return res.status(200).json({
                  success: 1,
                  data: body,
                });
              }
            }
          );
        });
      } else {
        // fs.unlinkSync(req.file.path);
        return res.status(409).json({
          success: 0,
          data: "email is already",
        });
      }
    });
  },
};

// // var CryptoJS = require("crypto-js");
// const fs = require("fs");
// const { getUserByUserEmail } = require("../service/user");
// const { createOtp } = require("../service/otp");
// const myDateModule = require("../util/date");
// const { randomInt } = require("crypto");
// module.exports = {
//   createOtp: (req, res, next) => {
//     const body = req.body;
//     getUserByUserEmail(body.email, (err, results) => {
//       if (err) {
//         console.log(err);
//         fs.unlinkSync(req.file.path);
//         return res.status(500).json({
//           success: 0,
//           message: "Database connection error",
//         });
//       }
//       if (!results) {
//         const verificationCode = randomInt(100000, 999999).toString();
//         console.log(`Verification code: ${verificationCode}`);
//         const createAt = myDateModule.getCurrentDateTimeFormatted();
//         const expiresAt = new Date();
//         expiresAt.setMinutes(expiresAt.getMinutes() + 30); // ตั้งเวลาหมดอายุใน 30 นาที
//         createOtp(
//           body.email,
//           verificationCode,
//           createAt,
//           expiresAt,
//           (err, createOtpResults) => {
//             if (err) {
//               console.log(err);
//               fs.unlinkSync(req.file.path);
//               return res.status(500).json({
//                 success: 0,
//                 message: "Database connection error",
//               });
//             } else {
//               next();
//             }
//           }
//         );
//       } else {
//         fs.unlinkSync(req.file.path);
//         return res.status(409).json({
//           success: 0,
//           data: "email is already",
//         });
//       }
//     });
//   },
// };

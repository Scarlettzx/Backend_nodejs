const {
  create,
  getUserByuserId,
  getUsers,
  updateUsertext,
  deleteUser,
  getUserByUserEmail,
  getUserByuserName,
  updateUserAll,
} = require("../service/user");
const fs = require("fs");
const { genSaltSync, hashSync, compareSync, compare } = require("bcrypt");
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
          create(body, createAt, updateAt, (err, results) => {
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
  getUserByuserId: (req, res) => {
    const id = req.params.id;
    getUserByuserId(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.status(404).json({
          success: 0,
          message: "Record not Found",
        });
      }
      results.user_password = undefined;
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

  getUserByuserName: (req, res) => {
    const name = req.params.name;
    getUserByuserName(name, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.status(404).json({
          success: 0,
          message: "Record not Found",
        });
      }
      // ! เอา password ออก
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(results);
      return res.status(200).json({
        users: results,
      });
    });
  },
  updateUsers: (req, res) => {
    const body = req.body;
    console.log(body);
    console.log(req.file);
    // const salt = genSaltSync(10);
    body.user_id = req.decoded.user_id;
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    // body.password = hashSync(body.password, salt);
    if (req.file) {
      body.avatar = req.file.filename;
      updateUserAll(body, updateAt, (err, results) => {
        if (err) {
          fs.unlinkSync(req.file.path);
          console.log(err);
          return false;
        }
        if (!results) {
          fs.unlinkSync(req.file.path);
          return res.json({
            success: 0,
            message: "Failed to Update user",
          });
        }
        return res.status(200).json({
          success: 1,
          data: "updated successfully",
          result: results,
        });
      });
    } else {
      updateUsertext(body, updateAt, (err, results) => {
        if (err) {
          console.log(err);
          return false;
        }
        if (!results) {
          return res.json({
            success: 0,
            message: "Failed to Update user",
          });
        }
        return res.status(200).json({
          success: 1,
          data: "updated successfully",
          result: results,
        });
      });
    }
  },
  deleteUser: (req, res) => {
    const data = req.body;
    deleteUser(data, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record Not Found",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "delete successfully",
      });
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
  // // ! Followers
  // getAllFollowers: (req, res) => {
  //   getAllFollowers((err, results) => {
  //     if (err) {
  //       return res.status(500).json({
  //         success: 0,
  //         message: "Database connection error",
  //         error: err,
  //       });
  //     }
  //     // ตรวจสอบว่า results เป็นอาร์เรย์และไม่ว่าง
  //     if (Array.isArray(results) && results.length > 0) {
  //       // ดึงรายการ person_id และ followers_id ทั้งหมดในอาร์เรย์ results
  //       const personIds = results.map((result) => result.person_id);
  //       // ใช้ map เพื่อดึงข้อมูลผู้ใช้สำหรับแต่ละ person_id
  //       const userDetailsPromises = personIds.map((personId) => {
  //         return new Promise((resolve, reject) => {
  //           getUserByuserId(personId, (err, userResult) => {
  //             if (err) {
  //               reject(err);
  //             } else {
  //               resolve(userResult);
  //             }
  //           });
  //         });
  //       });
  //       // รวมผลลัพธ์ของข้อมูลผู้ใช้ทั้งหมดใน Promise.all
  //       Promise.all(userDetailsPromises).then((userDetails) => {
  //         // userDetails เป็นอาร์เรย์ของผลลัพธ์ข้อมูลผู้ใช้
  //         // รวมข้อมูลผู้ใช้กับข้อมูลใน results ตามลำดับ
  //         for (let i = 0; i < results.length; i++) {
  //           results[i].person_id = userDetails[i];
  //           // ลบ user_password ออกจาก person_id
  //           delete results[i].person_id.user_password;
  //           // แปลงข้อมูล "followers_id" เป็น JSON object
  //           results[i].followers_id = JSON.parse(results[i].followers_id);
  //           // ลบ user_password ออกจาก followers_id
  //           delete results[i].followers_id.user_password;
  //         }
  //         return res.status(200).json({
  //           followers: results,
  //         });
  //       });
  //     } else {
  //       // กรณีไม่มีผู้ติดตามใน results
  //       return res.status(200).json({
  //         success: 1,
  //         data: [],
  //       });
  //     }
  //   });
  // },
  // addFollowers: (req, res) => {
  //   const body = req.body;
  //   const createAt = myDateModule.getCurrentDateTimeFormatted();
  //   req.body.person_id = req.decoded.user_id;
  //   // console.log(req.decoded.user_id);
  //   // ! WE ARE FOLLOWING WHO ?
  //   if (body.person_id == body.followers_id) {
  //     return res.status(400).json({
  //       success: 0,
  //       message: "You can't keep up with yourself.",
  //     });
  //   }
  //   checkFollower(body, (err, results) => {
  //     try {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }
  //       console.log(results);
  //       if (results.length == 0) {
  //         addFollower(body, createAt, (err, addFollowerResult) => {
  //           if (err) {
  //             console.log(err);
  //             return res.status(500).json({
  //               success: 0,
  //               message: "Database connection error",
  //             });
  //           }

  //           // สร้าง Promise สำหรับ person_id
  //           const personIdPromise = new Promise((resolve, reject) => {
  //             getUserByuserId(
  //               addFollowerResult.person_id,
  //               (err, userResult) => {
  //                 if (err) {
  //                   reject(err);
  //                 } else {
  //                   resolve(userResult);
  //                 }
  //               }
  //             );
  //           });

  //           // สร้าง Promise สำหรับ followers_id
  //           const followersIdPromise = new Promise((resolve, reject) => {
  //             getUserByuserId(
  //               addFollowerResult.followers_id,
  //               (err, userResult) => {
  //                 if (err) {
  //                   reject(err);
  //                 } else {
  //                   resolve(userResult);
  //                 }
  //               }
  //             );
  //           });
  //           // รวมผลลัพธ์ของ Promise ทั้งสอง
  //           Promise.all([personIdPromise, followersIdPromise]).then(
  //             (userDetails) => {
  //               // userDetails เป็นอาร์เรย์ของผลลัพธ์ข้อมูลผู้ใช้
  //               const personIdResult = userDetails[0];
  //               const followersIdResult = userDetails[1];

  //               // รวมข้อมูลผู้ใช้กับข้อมูลใน addFollowerResult
  //               addFollowerResult.person_id = personIdResult;
  //               // ลบ user_password ออกจาก person_id
  //               delete addFollowerResult.person_id.user_password;

  //               addFollowerResult.followers_id = followersIdResult;
  //               // ลบ user_password ออกจาก followers_id
  //               delete addFollowerResult.followers_id.user_password;

  //               return res.status(200).json({
  //                 success: 1,
  //                 data: "successfully",
  //                 result: addFollowerResult,
  //               });
  //             }
  //           );
  //         });
  //       } else {
  //         return res.status(409).json({
  //           success: 0,
  //           data: "You have already followed him.",
  //         });
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   });
  // },

  // // ! fetching followers ใครกำลังติดตามเรา
  // getAllFollowersuserid: (req, res) => {
  //   const user_id = req.params.user_id;
  //   // const body = req.body;
  //   // body.user_id = req.decoded.user_id;
  //   // console.log(req.decoded.user_id);
  //   getAllFollowersuserid(user_id, async (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).json({
  //         success: 0,
  //         message: "Database connection error",
  //       });
  //     }
  //     console.log(results.length);
  //     if (results.length == 0) {
  //       return res.status(404).json({
  //         success: 0,
  //         message: "No one is following you yet.",
  //         followers: results,
  //         followers_length: results.length,
  //       });
  //     } else {
  //       try {
  //         console.log(results);
  //         const personIds = results.map((result) => result.person_id);
  //         const followerIds = results.map((result) => result.followers_id);

  //         const personPromises = personIds.map((personId) => {
  //           return new Promise((resolve, reject) => {
  //             getUserByuserId(personId, (err, userResult) => {
  //               if (err) {
  //                 reject(err);
  //               } else {
  //                 resolve(userResult);
  //               }
  //             });
  //           });
  //         });

  //         const followerPromises = followerIds.map((followerId) => {
  //           return new Promise((resolve, reject) => {
  //             getUserByuserId(followerId, (err, userResult) => {
  //               if (err) {
  //                 reject(err);
  //               } else {
  //                 resolve(userResult);
  //               }
  //             });
  //           });
  //         });

  //         const [personDetails, followerDetails] = await Promise.all([
  //           Promise.all(personPromises),
  //           Promise.all(followerPromises),
  //         ]);

  //         // รวมผลลัพธ์ของข้อมูลผู้ใช้ทั้งหมดใน Promise.all
  //         // รวมข้อมูลผู้ใช้กับข้อมูลใน results ตามลำดับ
  //         for (let i = 0; i < results.length; i++) {
  //           results[i].person_id = personDetails[i];
  //           // ลบ user_password ออกจาก person_id
  //           delete results[i].person_id.user_password;
  //           // แปลงข้อมูล "followers_id" เป็น JSON object
  //           results[i].followers_id = followerDetails[i];
  //           // ลบ user_password ออกจาก followers_id
  //           delete results[i].followers_id.user_password;
  //         }

  //         return res.status(200).json({
  //           followers: results,
  //           followers_length: results.length,
  //         });
  //       } catch (e) {
  //         console.log(e);
  //         return res.status(500).json({
  //           success: 0,
  //           message: "Database connection error",
  //         });
  //       }
  //     }
  //   });
  // },
  // // ! fetching following เรากำลังติดตามใคร
  // getAllFollowinguserid: (req, res) => {
  //   const user_id = req.params.user_id;
  //   // body.user_id = req.decoded.user_id;
  //   // console.log(req.decoded.user_id);
  //   getAllFollowinguserid(user_id, async (err, results) => {
  //     console.log(results);
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).json({
  //         success: 0,
  //         message: "Database connection error",
  //       });
  //     }
  //     console.log(results.length);
  //     if (results.length == 0) {
  //       return res.status(404).json({
  //         success: 0,
  //         message: "You aren't following anyone yet.",
  //         following: results,
  //         following_length: results.length,
  //       });
  //     } else {
  //       try {
  //         console.log(results);
  //         const personIds = results.map((result) => result.person_id);
  //         const followerIds = results.map((result) => result.followers_id);

  //         const personPromises = personIds.map((personId) => {
  //           return new Promise((resolve, reject) => {
  //             getUserByuserId(personId, (err, userResult) => {
  //               if (err) {
  //                 reject(err);
  //               } else {
  //                 resolve(userResult);
  //               }
  //             });
  //           });
  //         });

  //         const followerPromises = followerIds.map((followerId) => {
  //           return new Promise((resolve, reject) => {
  //             getUserByuserId(followerId, (err, userResult) => {
  //               if (err) {
  //                 reject(err);
  //               } else {
  //                 resolve(userResult);
  //               }
  //             });
  //           });
  //         });

  //         const [personDetails, followerDetails] = await Promise.all([
  //           Promise.all(personPromises),
  //           Promise.all(followerPromises),
  //         ]);

  //         // รวมผลลัพธ์ของข้อมูลผู้ใช้ทั้งหมดใน Promise.all
  //         // รวมข้อมูลผู้ใช้กับข้อมูลใน results ตามลำดับ
  //         for (let i = 0; i < results.length; i++) {
  //           results[i].person_id = personDetails[i];
  //           // ลบ user_password ออกจาก person_id
  //           delete results[i].person_id.user_password;
  //           // แปลงข้อมูล "followers_id" เป็น JSON object
  //           results[i].followers_id = followerDetails[i];
  //           // ลบ user_password ออกจาก followers_id
  //           delete results[i].followers_id.user_password;
  //         }

  //         return res.status(200).json({
  //           following: results,
  //           following_length: results.length,
  //         });
  //       } catch (e) {
  //         console.log(e);
  //         return res.status(500).json({
  //           success: 0,
  //           message: "Database connection error",
  //         });
  //       }
  //     }
  //   });
  // },
  // unfollowers: (req, res) => {
  //   const body = req.body;
  //   req.body.person_id = req.decoded.user_id;
  //   unfollowers(body, (err, results) => {
  //     try {
  //       if (err) {
  //         console.log(err);
  //         return res.status(500).json({
  //           success: 0,
  //           message: "Database connection error",
  //         });
  //       }
  //       return res.status(200).json({
  //         success: 1,
  //         message: "unfollower acccept",
  //       });
  //     } catch (error) {
  //       console.log(err);
  //     }
  //   });
  // },
  // checkFollowerprofile: (req, res) => {
  //   const body = req.body;
  //   body.person_id = req.decoded.user_id;
  //   // console.log(req.decoded.user_id);
  //   checkFollower(body, (err, results) => {
  //     try {
  //       if (err) {
  //         console.log(err);
  //         return res.status(500).json({
  //           success: 0,
  //           message: "Database connection error",
  //         });
  //       }
  //       console.log(results);
  //       if (results.length == 0) {
  //         return res.status(200).json({
  //           followers: false,
  //         });
  //       } else {
  //         return res.status(200).json({
  //           followers: true,
  //         });
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   });
  // },
};

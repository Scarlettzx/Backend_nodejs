const {
  getAllBand,
  createBand,
  getbandBybandId,
  getbandBybandName,
  updateFounderBandType,
  updateMemberBandType,
  checkMemberInBand,
  deleteMemberInBand,
  deleteBand,
  checkFounderInBand,
  editBandAll,
  editBandText,
  // editBand,
  // deletebandinFollower,
} = require("../service/band");
const { getUserByuserId } = require("../service/user");
const {
  deleteNotiInvitetojoinbandByband,
  deleteNotiInvitetojoinbandByuser,
  deleteNotibydeleteBand,
  getNotificationfordeletebandbyuser,
} = require("../service/notification");
const myDateModule = require("../util/date");
const fs = require("fs");

module.exports = {
  getAllBands: (req, res) => {
    getAllBand((err, results) => {
      if (err) {
        console.log(err);
        return;
      } else if (results.length == 0) {
        return res.status(404).json({
          success: 0,
          data: "No have data in DB",
        });
      } else {
        console.log(results);
        const sanitizedResults = results.map((result) => {
          const { user_password, ...sanitizedResult } = result;
          return sanitizedResult;
        });
        const finalresults = sanitizedResults.map((sanitizedResult) => {
          const {
            user_id,
            user_email,
            user_name,
            user_createAt,
            user_updateAt,
            user_country,
            user_position,
            user_avatar,
            user_isAdmin,
            band_id,
            band_Type,
            ...sanitizedUser
          } = sanitizedResult;

          const createBandBy = {
            user_id: user_id,
            user_email: user_email,
            user_name: user_name,
            user_country: user_country,
            user_position: user_position,
            user_avatar: user_avatar,
            user_isAdmin: user_isAdmin,
            user_createAt: user_createAt,
            user_updateAt: user_updateAt,
            band_id: band_id,
            band_Type: band_Type,
          };

          return {
            ...sanitizedUser,
            createBandBy,
          };
        });
        return res.status(200).json({
          bands: finalresults,
        });
      }
    });
  },
  createBand: (req, res) => {
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    const body = req.body;
    req.body.user_id = req.decoded.user_id;
    // ! import Utils from /util/date by using moment into format datetime
    // ?  Check to see if there are duplicate emails in the database. If so, return message email is already
    getUserByuserId(body.user_id, (err, userIdresults) => {
      console.log(userIdresults + "first check");
      if (userIdresults.band_id == null && userIdresults.band_Type == "0") {
        getbandBybandName(body.name, (err, results) => {
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
              // console.log(body);
              createBand(body, createAt, updateAt, (err, createBandResults) => {
                if (err) {
                  fs.unlinkSync(req.file.path);
                  console.log(err);
                  return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                  });
                } else {
                  updateFounderBandType(
                    body.user_id,
                    createBandResults.band_id,
                    updateAt,
                    (err, FounderResults) => {
                      console.log(FounderResults + "'''''");
                      console.log(createBandResults.band_id);
                      if (err) {
                        console.log(err);
                        return false;
                      }
                      if (!FounderResults) {
                        fs.unlinkSync(req.file.path);
                        return res.status(404).json({
                          success: 0,
                          message: "User not found",
                        });
                      }
                      FounderResults.user_password = undefined;
                      const ResultsBand = {
                        createBandResults,
                        createBandBy: FounderResults,
                      };
                      console.log(results);
                      return res.status(200).json({
                        success: 1,
                        data: ResultsBand,
                      });
                    }
                  );
                }
              });
            } else {
              fs.unlinkSync(req.file.path);
              return res.status(409).json({
                success: 0,
                message: "band is already",
              });
            }
          } catch (err) {
            console.log(err);
          }
        });
      } else if (
        userIdresults.band_id != null &&
        userIdresults.band_Type == "2"
      ) {
        fs.unlinkSync(req.file.path);
        return res.status(409).json({
          success: 0,
          message: "Only one band can be created.",
        });
      } else if (
        userIdresults.band_id != null &&
        userIdresults.band_Type == "1"
      ) {
        fs.unlinkSync(req.file.path);
        return res.status(409).json({
          success: 0,
          message:
            "You cannot create a band because you are currently a member of a band.",
        });
      }
    });
  },

  getbandBybandName: (req, res) => {
    const name = req.params.name;
    getbandBybandName(name, (err, results) => {
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

  getbandBybandId: (req, res) => {
    const id = req.params.id;
    getbandBybandId(id, (err, results) => {
      console.log(!results);
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
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  invtetoJoinBandbyuser: (req, res) => {
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    const body = req.body;
    // ! check band_Type in TABLE users ของ user_id คนนั้นที่กำลังจะไปเชิญ
    // ! ว่า band_Type = "2" ไหม ถ้าใช่ให้ทำต่อ ถ้าไม่ใช่ response 404
    if (body.user_id == body.person_id) {
      return res.status(404).json({
        success: 0,
        message: "You cannot invite yourself to join the band",
      });
    }
    getUserByuserId(body.user_id, (err, userIdresults) => {
      // console.log("userIdresults");
      // console.log(userIdresults);
      // console.log(typeof userIdresults.band_Type);
      // console.log(userIdresults.band_Type);
      if (err) {
        console.log(err);
        return;
      }
      if (userIdresults.band_Type != "2") {
        return res.status(404).json({
          success: 0,
          message: "The band has disbanded.",
        });
      } else {
        // ! Check the band members (Maximum == 4)
        checkMemberInBand(userIdresults.band_id, (err, checkMemberResults) => {
          console.log(checkMemberResults);
          console.log(checkMemberResults.length);
          // console.log((checkMemberResults.band_Type == "1").length);
          // นับจำนวนคนที่มี band_Type เป็น "1"
          const countBandType1 = checkMemberResults.reduce((count, member) => {
            if (member.band_Type === "1") {
              count += 1;
            }
            return count;
          }, 0);
          console.log("Number of members with band_Type 1:", countBandType1);
          if (err) {
            console.log(err);
            return;
          } else if (countBandType1 == 4) {
            return res.status(404).json({
              success: 0,
              message: "The band members are full.",
            });
          } else {
            // ! check person_id him have a band ?
            getUserByuserId(body.person_id, (err, persoIdresults) => {
              if (err) {
                console.log(err);
                return;
              } else if (!persoIdresults) {
                return res.status(404).json({
                  success: 0,
                  message: "Record not Found",
                });
              }
              if (persoIdresults.band_Type == "0") {
                updateMemberBandType(
                  body.person_id,
                  userIdresults.band_id,
                  updateAt,
                  (err, results) => {
                    if (err) {
                      console.log(err);
                      return;
                    } else if (!results) {
                      return res.status(404).json({
                        success: 0,
                        message: "User not found",
                      });
                    } else {
                      deleteNotiInvitetojoinbandByuser(
                        body.user_id,
                        body.person_id,
                        (err, deltenotiResults) => {
                          if (err) {
                            console.log(err);
                            return;
                          } else {
                            console.log(results);
                            results.user_password = undefined;
                            return res.status(200).json({
                              success: 1,
                              data: results,
                            });
                          }
                        }
                      );
                    }
                  }
                );
              } else if (
                persoIdresults.band_Type == "1" ||
                persoIdresults.band_Type == "2"
              ) {
                return res.status(404).json({
                  success: 0,
                  message: "This user already has a band.",
                });
              }
            });
          }
        });
      }
    });
  },
  invtetoJoinBandbyband: (req, res) => {
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    const body = req.body;
    // ! check band_Type in TABLE users ของ user_id คนนั้นที่กำลังจะไปเชิญ
    // ! ว่า band_Type = "2" ไหม ถ้าใช่ให้ทำต่อ ถ้าไม่ใช่ response 404
    getbandBybandId(body.band_id, (err, bandIdesults) => {
      // console.log("userIdresults");
      // console.log(userIdresults);
      // console.log(typeof userIdresults.band_Type);
      // console.log(userIdresults.band_Type);
      if (err) {
        console.log(err);
        return;
      }
      if (!bandIdesults) {
        return res.status(404).json({
          success: 0,
          message: "Band not found",
        });
      } else {
        // ! Check the band members (Maximum == 4)
        checkMemberInBand(body.band_id, (err, checkMemberResults) => {
          console.log(checkMemberResults);
          console.log(checkMemberResults.length);
          // console.log((checkMemberResults.band_Type == "1").length);
          // นับจำนวนคนที่มี band_Type เป็น "1"
          const countBandType1 = checkMemberResults.reduce((count, member) => {
            if (member.band_Type === "1") {
              count += 1;
            }
            return count;
          }, 0);
          console.log("Number of members with band_Type 1:", countBandType1);
          if (err) {
            console.log(err);
            return;
          } else if (countBandType1 == 4) {
            return res.status(404).json({
              success: 0,
              message: "The band members are full.",
            });
          } else {
            // ! check person_id him have a band ?
            getUserByuserId(body.person_id, (err, persoIdresults) => {
              if (err) {
                console.log(err);
                return;
              } else if (!persoIdresults) {
                return res.status(404).json({
                  success: 0,
                  message: "Record not Found",
                });
              }
              if (persoIdresults.band_Type == "0") {
                updateMemberBandType(
                  body.person_id,
                  body.band_id,
                  updateAt,
                  (err, results) => {
                    if (err) {
                      console.log(err);
                      return;
                    } else if (!results) {
                      return res.status(404).json({
                        success: 0,
                        message: "User not found",
                      });
                    } else {
                      deleteNotiInvitetojoinbandByband(
                        body.band_id,
                        body.person_id,
                        (err, deltenotiResults) => {
                          if (err) {
                            console.log(err);
                            return;
                          } else {
                            console.log(results);
                            results.user_password = undefined;
                            return res.status(200).json({
                              success: 1,
                              data: results,
                            });
                          }
                        }
                      );
                    }
                  }
                );
              } else if (
                persoIdresults.band_Type == "1" ||
                persoIdresults.band_Type == "2"
              ) {
                return res.status(404).json({
                  success: 0,
                  message: "This user already has a band.",
                });
              }
            });
          }
        });
      }
    });
  },
  // ! ยุบวง เช็คก่อนว่า user นี้ band_Type = 1 or 2  if 2 ให้ยุบวงได้
  // ! if band_Type = 1 "not have permission deleteband"
  // ! if band_Type = 0
  deleteBand: (req, res) => {
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    const body = req.body;
    body.user_id = req.decoded.user_id;
    getbandBybandId(body.band_id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else if (!results) {
        return res.status(404).json({
          success: 0,
          data: "Not have this band",
        });
      } else {
        checkFounderInBand(body.user_id, (err, results) => {
          try {
            if (err) {
              console.log(err);
              return;
              // ! check band_Type in Table user if != 2
              // ! ตัว results จะ where จาก user_id และ band_id ที่ band_Type = 2
              // ! !results แสดงว่าไม่ใช่
            } else if (!results) {
              return res.status(409).json({
                success: 0,
                message: "You don't have permission to delete this band",
              });
            } else if (body.band_id != results.band_id) {
              return res.status(409).json({
                success: 0,
                message: "You don't have permission to delete other band",
              });
            } else {
              // ! deleteNotibydeleteBand
              getNotificationfordeletebandbyuser(
                body.user_id,
                (err, resultsgetuseridnoti) => {
                  console.log(resultsgetuseridnoti);
                  if (err) {
                    console.log(err);
                    return;
                  } else {
                    const userIdnotis = resultsgetuseridnoti.map(
                      (result) => result.user_id
                    );
                    userIdnotis.map((userIdnoti) => {
                      return new Promise((resolve, reject) => {
                        // ! update band_id = null and band_Type = 0 each users
                        deleteNotibydeleteBand(
                          userIdnoti,
                          (err, userResult) => {
                            if (err) {
                              reject(err);
                            } else {
                              resolve(userResult);
                            }
                          }
                        );
                      });
                    });

                    checkMemberInBand(body.band_id, (err, results) => {
                      if (err) {
                        console.log(err);
                        return;
                      } else if (Array.isArray(results) && results.length > 0) {
                        // ดึงรายการ person_id และ followers_id ทั้งหมดในอาร์เรย์ results
                        const userIds = results.map((result) => result.user_id);
                        // ใช้ map เพื่อดึงข้อมูลผู้ใช้สำหรับแต่ละ person_id
                        const updateAllusersPromises = userIds.map((userId) => {
                          return new Promise((resolve, reject) => {
                            // ! update band_id = null and band_Type = 0 each users
                            deleteMemberInBand(
                              userId,
                              updateAt,
                              (err, userResult) => {
                                if (err) {
                                  reject(err);
                                } else {
                                  resolve(userResult);
                                }
                              }
                            );
                          });
                        });
                        // รวมผลลัพธ์ของข้อมูลผู้ใช้ทั้งหมดใน Promise.all
                        Promise.all(updateAllusersPromises).then(
                          (userDetails) => {
                            // userDetails เป็นอาร์เรย์ของผลลัพธ์ข้อมูลผู้ใช้
                            // รวมข้อมูลผู้ใช้กับข้อมูลใน results ตามลำดับ
                            for (let i = 0; i < results.length; i++) {
                              delete results[i].user_password;
                            }
                            deleteBand(body.band_id, (err, results) => {
                              console.log(results);
                              if (err) {
                                console.log(err);
                                return;
                              } else {
                                return res.status(200).json({
                                  success: 1,
                                  data: "delete successfully",
                                });
                              }
                            });
                          }
                        );
                      } else {
                        // ! don't have data IN DB
                        return res.status(200).json({
                          success: 1,
                          data: [],
                        });
                      }
                    });
                  }
                }
              );
            }
          } catch (e) {
            console.log(e);
          }
        });
      }
    });
  },
  editBandByFounder: (req, res) => {
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    const body = req.body;
    body.user_id = req.decoded.user_id;
    getbandBybandId(body.band_id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else if (!results) {
        return res.status(404).json({
          success: 0,
          data: "Not have this band",
        });
      } else {
        checkFounderInBand(body.user_id, (err, results) => {
          try {
            if (err) {
              console.log(err);
              return;
              // ! check band_Type in Table user if != 2
              // ! ตัว results จะ where จาก user_id และ band_id ที่ band_Type = 2
              // ! !results แสดงว่าไม่ใช่
            } else if (!results) {
              return res.status(409).json({
                success: 0,
                message: "You don't have permission to edit this band",
              });
            } else if (body.band_id != results.band_id) {
              return res.status(409).json({
                success: 0,
                message: "You don't have permission to edit other band",
              });
            } else {
              if (req.file) {
                body.avatar = req.file.filename;
                editBandAll(body, updateAt, (err, results) => {
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
                editBandText(body, updateAt, (err, results) => {
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
            }
          } catch (error) {
            console.log(error);
          }
        });
      }
    });
  },
  leaveBandByMemberuserid: (req, res) => {
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    const body = req.body;
    body.user_id = req.decoded.user_id;
    getbandBybandId(body.band_id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else if (!results) {
        return res.status(404).json({
          success: 0,
          data: "Not have this band",
        });
      } else {
        getUserByuserId(body.user_id, (err, userresults) => {
          try {
            if (err) {
              console.log(err);
              return;
            } else if (
              userresults.band_Type == "2" &&
              userresults.band_id == body.band_id
            ) {
              return res.status(409).json({
                success: 0,
                data: "You cannot leave the band because you are the band leader.",
              });
            } else if (userresults.band_Type == "0") {
              return res.status(409).json({
                success: 0,
                data: "You can't leave a band because you don't have a band yet.",
              });
            } else if (
              userresults.band_Type == "1" &&
              userresults.band_id == body.band_id
            ) {
              // ! member leaveband
              deleteMemberInBand(
                body.user_id,
                updateAt,
                (err, deleteresults) => {
                  console.log(userresults);
                  console.log(deleteresults);
                  if (err) {
                    console.log(err);
                    return false;
                  } else {
                    return res.status(200).json({
                      success: 1,
                      data: deleteresults,
                    });
                  }
                }
              );
            } else {
              return res.status(409).json({
                success: 0,
                data: "You can't leave a band because you're in another band.",
              });
            }
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
  },
  checkMemberInBand: (req, res) => {
    const band_id = req.params.bandid;
    getbandBybandId(band_id, (err, Bandresults) => {
      if (err) {
        console.log(err);
        return;
      } else if (!Bandresults) {
        return res.status(404).json({
          success: 0,
          data: "Not have this band",
        });
      } else {
        checkMemberInBand(band_id, (err, results) => {
          if (err) {
            console.log(err);
            return;
          } else {
            // ลบค่า user_password ออกจากทุกองค์กระทั่งข้อมูล
            results = results.map((user) => {
              delete user.user_password;
              return user;
            });
            return res.status(200).json({
              Band: Bandresults,
              Member: results,
            });
          }
        });
      }
    });
  },
  leaveBandByFounder: (req, res) => {
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    const body = req.body;
    body.user_id = req.decoded.user_id;
    if (body.user_id == body.person_id) {
      return res.status(404).json({
        success: 0,
        message: "You can't remove yourself from your own band.",
      });
    }
    getbandBybandId(body.band_id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else if (!results) {
        return res.status(404).json({
          success: 0,
          data: "Not have this band",
        });
      } else {
        getUserByuserId(body.user_id, (err, userresults) => {
          try {
            if (err) {
              console.log(err);
              return;
            } else if (
              userresults.band_Type == "2" &&
              body.band_id == userresults.band_id
            ) {
              // เรียก getUserByuserId อีกรอบเพื่อเช็คเงื่อนไขต่อไป
              getUserByuserId(body.person_id, (err, personResults) => {
                if (err) {
                  console.log(err);
                  return;
                } else if (
                  personResults.band_Type == "1" &&
                  body.band_id == personResults.band_id
                ) {
                  // ทำการลบสมาชิกในแบนด์เมื่อผ่านเงื่อนไขทั้งสอง
                  deleteMemberInBand(
                    body.person_id,
                    updateAt,
                    (err, deleteResult) => {
                      if (err) {
                        console.log(err);
                        return;
                      } else {
                        deleteResult.user_password = undefined;
                        return res.status(200).json({
                          success: 1,
                          data: deleteResult,
                        });
                      }
                    }
                  );
                } else {
                  return res.status(403).json({
                    success: 0,
                    data: "You don't have permission to delete this member",
                  });
                }
              });
            } else {
              return res.status(403).json({
                success: 0,
                data: "You don't have permission to delete this member",
              });
            }
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
  },
};

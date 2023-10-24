const {
  createNotiInvitetojoinbandByuser,
  createNotiInvitetojoinbandByband,
  checkInviteBandbyuser,
  checkInviteBandbyband,
  deleteNotiInvitetojoinbandByband,
  deleteNotiInvitetojoinbandByuser,
  getNotificationbyuserid,
  checkOfferuser,
  checkOfferband,
  sendOfferuser,
  sendOfferband,
  // getAllComments,
  // getComment,
} = require("../service/notification");
const fs = require("fs");
const path = require("path");
const { getUserByuserId } = require("../service/user");
const { getbandBybandId } = require("../service/band");
const { checkMemberInBand, findFounderInBand } = require("../service/band");
const nodemailer = require("nodemailer");
const myDateModule = require("../util/date");
module.exports = {
  createNotiByuser: (req, res) => {
    const body = req.body;
    body.user_id = req.decoded.user_id;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    getUserByuserId(body.user_id, (err, persoIdresults) => {
      if (err) {
        console.log(err);
        return;
      } else if (!persoIdresults) {
        return res.status(404).json({
          success: 0,
          message: "Record not Found",
        });
      } else {
        checkMemberInBand(persoIdresults.band_id, (err, checkMemberResults) => {
          console.log("checkMemberResults.length");
          console.log(checkMemberResults.length);
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection error",
            });
          } else if (checkMemberResults.length === 5) {
            return res.status(404).json({
              success: 0,
              message: "The band members are full.",
            });
          } else {
            checkInviteBandbyuser(
              body.user_id,
              body.person_id,
              (err, resultscheckband) => {
                console.log(resultscheckband);
                if (err) {
                  console.log(err);
                  return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                  });
                } else if (resultscheckband) {
                  return res.status(404).json({
                    success: 0,
                    message: "You invited this person",
                  });
                } else {
                  checkInviteBandbyband(
                    persoIdresults.band_id,
                    body.person_id,
                    (err, resultscheckinvite) => {
                      if (resultscheckinvite) {
                        return res.status(404).json({
                          success: 0,
                          message: "You invited this person",
                        });
                      } else {
                        createNotiInvitetojoinbandByuser(
                          body,
                          createAt,
                          async (err, results) => {
                            if (err) {
                              console.log(err);
                              return res.status(500).json({
                                success: 0,
                                message: "Database connection error",
                              });
                            } else {
                              return res.status(200).json({
                                success: 1,
                                message: "invitedbandByuser successfully",
                                results: results,
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    });
  },
  createNotiByband: (req, res) => {
    console.log("req.decoded.user_id");
    console.log(req.decoded.user_id);
    const body = req.body;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    checkMemberInBand(body.band_id, (err, checkMemberResults) => {
      console.log("checkMemberResults.length");
      console.log(checkMemberResults.length);
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      } else {
        if (checkMemberResults.length === 5) {
          return res.status(404).json({
            success: 0,
            message: "The band members are full.",
          });
        }
      }
      checkInviteBandbyband(
        body.band_id,
        body.person_id,
        (err, resultscheckinvite) => {
          if (resultscheckinvite) {
            return res.status(404).json({
              success: 0,
              message: "You invited this person",
            });
          } else {
            checkInviteBandbyuser(
              req.decoded.user_id,
              body.person_id,
              (err, resultscheckband) => {
                console.log(resultscheckband);
                if (err) {
                  console.log(err);
                  return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                  });
                } else if (resultscheckband) {
                  return res.status(404).json({
                    success: 0,
                    message: "You invited this person",
                  });
                } else {
                  createNotiInvitetojoinbandByband(
                    body,
                    createAt,
                    async (err, results) => {
                      if (err) {
                        console.log(err);
                        return res.status(500).json({
                          success: 0,
                          message: "Database connection error",
                        });
                      } else {
                        return res.status(200).json({
                          success: 1,
                          message: "invitedbandByband successfully",
                          results: results,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
  },
  checkInviteBandbyband: async (req, res) => {
    const body = req.body;
    const checkInviteBandbyuserresults = (user_id, person_id) => {
      return new Promise((resolve, reject) => {
        checkInviteBandbyuser(user_id, person_id, (err, userDetails) => {
          if (err) {
            reject(err);
          } else {
            resolve(userDetails);
          }
        });
      });
    };

    const checkInviteBandbybandresults = (band_id, person_id) => {
      return new Promise((resolve, reject) => {
        checkInviteBandbyband(band_id, person_id, (err, userDetails) => {
          if (err) {
            reject(err);
          } else {
            resolve(userDetails);
          }
        });
      });
    };
    try {
      const userInviteResult = await checkInviteBandbyuserresults(
        req.decoded.user_id,
        body.person_id
      );

      if (userInviteResult) {
        return res.status(200).json({
          invited: true,
        });
      } else {
        const bandInviteResult = await checkInviteBandbybandresults(
          body.band_id,
          body.person_id
        );

        if (bandInviteResult) {
          return res.status(200).json({
            invited: true,
          });
        } else {
          return res.status(200).json({
            invited: false,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
  },

  checkInviteBandbyuser: async (req, res) => {
    const body = req.body;
    body.user_id = req.decoded.user_id;
    const getBandtoUserid = (id) => {
      return new Promise((resolve, reject) => {
        getUserByuserId(id, (err, userDetails) => {
          if (err) {
            reject(err);
          } else {
            resolve(userDetails);
          }
        });
      });
    };
    const checkInviteBandbyuserresults = (user_id, person_id) => {
      return new Promise((resolve, reject) => {
        checkInviteBandbyuser(user_id, person_id, (err, userDetails) => {
          if (err) {
            reject(err);
          } else {
            resolve(userDetails);
          }
        });
      });
    };

    const checkInviteBandbybandresults = (band_id, person_id) => {
      return new Promise((resolve, reject) => {
        checkInviteBandbyband(band_id, person_id, (err, userDetails) => {
          if (err) {
            reject(err);
          } else {
            resolve(userDetails);
          }
        });
      });
    };
    try {
      const personDetails = await getBandtoUserid(body.user_id);

      if (!personDetails) {
        return res.status(404).json({
          success: 0,
          message: "Record not Found",
        });
      }
      const bandInviteResult = await checkInviteBandbybandresults(
        personDetails.band_id,
        body.person_id
      );
      if (bandInviteResult) {
        return res.status(200).json({
          invited: true,
        });
      } else {
        const userInviteResult = await checkInviteBandbyuserresults(
          body.user_id,
          body.person_id
        );
        if (userInviteResult) {
          return res.status(200).json({
            invited: true,
          });
        } else {
          return res.status(200).json({
            invited: false,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
  },
  deletenotiInvitebandbyband: (req, res) => {
    const body = req.body;
    deleteNotiInvitetojoinbandByband(
      body.band_id,
      body.person_id,
      (err, results) => {
        try {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection error",
            });
          }
          return res.status(200).json({
            success: 1,
            message: "deleteinvitejoinband acccept",
          });
        } catch (error) {
          console.log(err);
        }
      }
    );
  },
  deletenotiInvitebandbyuser: (req, res) => {
    const body = req.body;
    // body.user_id = req.decode.user_id;
    deleteNotiInvitetojoinbandByuser(
      body.user_id,
      body.person_id,
      (err, results) => {
        try {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection error",
            });
          }
          return res.status(200).json({
            success: 1,
            message: "deleteinvitejoinband acccept",
          });
        } catch (error) {
          console.log(err);
        }
      }
    );
  },
  getNotifications: (req, res) => {
    const body = req.body;
    body.person_id = req.decoded.user_id;
    // const findFounderInBandAsync = (band_id) => {
    //   return new Promise((resolve, reject) => {
    //     findFounderInBand(band_id, (err, userDetails) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(userDetails);
    //       }
    //     });
    //   });
    // };
    // const getUserByuserIdAsync = (id) => {
    //   return new Promise((resolve, reject) => {
    //     getUserByuserId(id, (err, userDetails) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(userDetails);
    //       }
    //     });
    //   });
    // };
    getNotificationbyuserid(body.person_id, (err, results) => {
      console.log("results");
      console.log(results);
      if (err) {
        console.log(err);
        return;
      }
      // ตรวจสอบว่า results เป็นอาร์เรย์และไม่ว่าง
      if (Array.isArray(results) && results.length > 0) {
        // ใช้ map ในการสร้างอาร์เรย์ใหม่ transformedResults
        // แปลง getUserByuserId เป็น Promise
        const getUserByuserIdAsync = (id) => {
          return new Promise((resolve, reject) => {
            getUserByuserId(id, (err, userDetails) => {
              if (err) {
                reject(err);
              } else {
                resolve(userDetails);
              }
            });
          });
        };

        // แปลง getbandBybandId เป็น Promise
        const getbandBybandIdAsync = (id) => {
          return new Promise((resolve, reject) => {
            getbandBybandId(id, (err, bandDetails) => {
              if (err) {
                reject(err);
              } else {
                resolve(bandDetails);
              }
            });
          });
        };
        // ใช้ Promises ในการดึงข้อมูลและแปลงผลลัพธ์
        const transformedResultsPromises = results.map(async (result) => {
          const transformedResult = {
            noti_id: result.noti_id,
            noti_type: result.noti_type,
            noti_createAt: result.noti_createAt,
          };

          if (result.user_id !== null) {
            const userDetails = await getUserByuserIdAsync(result.user_id);
            // คัดลอกคุณสมบัติทั้งหมดจาก userDetails แต่ไม่รวม user_password
            transformedResult.person_details = { ...userDetails };
            delete transformedResult.person_details.user_password;
          }
          if (result.band_id !== null) {
            const bandDetails = await getbandBybandIdAsync(result.band_id);
            transformedResult.band_details = bandDetails;
          }
          // if (result.person_id !== null) {
          //   const bandDetails = await getbandBybandIdAsync(result.banded_id);
          //   transformedResult.band_details = bandDetails;
          // }
          // if (result.banded_id !== null) {
          //   const bandDetails = await getbandBybandIdAsync(result.banded_id);
          //   transformedResult.band_details = bandDetails;
          // }
          return transformedResult;
        });
        // รวมผลลัพธ์ของ Promises ทั้งหมด
        Promise.all(transformedResultsPromises)
          .then((transformedResults) => {
            return res.status(200).json({
              notifications: transformedResults,
            });
          })
          .catch((error) => {
            return res.status(500).json({
              success: 0,
              message: "Error while fetching data",
              error: error,
            });
          });
      } else {
        // กรณีไม่มีผู้ติดตามใน results
        return res.status(200).json({
          notifications: [],
        });
      }
    });
  },
  sendOfferuser: (req, res) => {
    console.log("req.decoded.user_id");
    console.log(req.decoded.user_id);
    const body = req.body;
    body.user_id = req.decoded.user_id;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    if (body.user_id == body.person_id) {
      return res.status(404).json({
        success: 0,
        message: "You dont sent Offer to him",
      });
    }
    getUserByuserId(body.person_id, (err, persoIdresults) => {
      if (err) {
        console.log(err);
        return;
      } else if (!persoIdresults) {
        return res.status(404).json({
          success: 0,
          message: "Record not Found",
        });
      } else {
        checkOfferuser(
          body.user_id,
          body.person_id,
          (err, checkOfferuserResults) => {
            if (checkOfferuserResults) {
              return res.status(403).json({
                success: 0,
                message: "You offered this person",
              });
            } else {
              getUserByuserId(body.user_id, (err, userIdresults) => {
                if (err) {
                  console.log(err);
                  return;
                } else if (!userIdresults) {
                  return res.status(404).json({
                    success: 0,
                    message: "Record not Found",
                  });
                } else {
                  // setup mail transporter service
                  const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: "scarlettz.mew@gmail.com", // your email
                      pass: "weyikaslwumevykt", // your password
                    },
                  });

                  // อ่านเนื้อหาของไฟล์ HTML ที่คุณสร้าง
                  const htmlTemplate = fs.readFileSync(
                    path.join(__dirname, "../template/email.html"),
                    "utf8"
                  );

                  // แทรกข้อมูลที่คุณต้องการในเทมเพลต HTML
                  const Contact = "ยื่นเสนองานให้นักดนตรี";
                  const name = `ผู้ใช้ ${userIdresults.user_name}`;
                  const email = userIdresults.user_email;
                  const message =
                    "ต้องการจะติดต่อเสนองานให้คุณถ้าสนใจโปรดตอบกลับอีเมลนี้";

                  const emailContent = htmlTemplate
                    .replace("${name}", name)
                    .replace("${email}", email)
                    .replace("${message}", message)
                    .replace("${Contact}", Contact);

                  const mailOptions = {
                    from: "scarlettz.mew@gmail.com",
                    to: persoIdresults.user_email, // list of receivers
                    html: emailContent, // แทนที่ "html" ด้วย "emailContent"
                  };
                  // send mail with defined transport object
                  try {
                    transporter.sendMail({
                      ...mailOptions,
                      subject: `Tungwong Mobile Application🎵🎷🎸🎹🎙️`,
                    });
                  } catch (err) {
                    console.log(err);
                    return res.status(400).json({ message: err.message });
                  }

                  sendOfferuser(body, createAt, (err, sendOfferuserResults) => {
                    if (err) {
                      console.log(err);
                      return;
                    } else {
                      return res.status(200).json({
                        success: 1,
                        message: "sendOfferuser successfully",
                        results: sendOfferuserResults,
                      });
                    }
                  });
                }
              });
            }
          }
        );
      }
    });
  },
  sendOfferband: (req, res) => {
    console.log("req.decoded.user_id");
    console.log(req.decoded.user_id);
    const body = req.body;
    body.user_id = req.decoded.user_id;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    getbandBybandId(body.band_id, (err, bandIdresults) => {
      if (err) {
        console.log(err);
        return;
      } else if (!bandIdresults) {
        return res.status(404).json({
          success: 0,
          message: "Record not Found",
        });
      } else {
        checkOfferband(
          body.user_id,
          body.band_id,
          (err, checkOfferbandResults) => {
            if (checkOfferbandResults) {
              return res.status(403).json({
                success: 0,
                message: "You offered this person",
              });
            } else {
              findFounderInBand(body.band_id, (err, checkmemResults) => {
                console.log(checkmemResults);
                if (err) {
                  console.log(err);
                  return;
                } else if(!checkmemResults){
                  return res.status(404).json({
                    success: 0,
                    message: "The band has disbanded.",
                  });
                 } else{ getUserByuserId(
                    checkmemResults.user_id,
                    (err, personIdresults) => {
                      if (err) {
                        console.log(err);
                        return;
                      } else if (!personIdresults) {
                        return res.status(404).json({
                          success: 0,
                          message: "Record not Found",
                        });
                      } else {
                        // setup mail transporter service
                        const transporter = nodemailer.createTransport({
                          service: "gmail",
                          auth: {
                            user: "scarlettz.mew@gmail.com", // your email
                            pass: "weyikaslwumevykt", // your password
                          },
                        });

                        // อ่านเนื้อหาของไฟล์ HTML ที่คุณสร้าง
                        const htmlTemplate = fs.readFileSync(
                          path.join(__dirname, "../template/email.html"),
                          "utf8"
                        );

                        // แทรกข้อมูลที่คุณต้องการในเทมเพลต HTML
                        const Contact = "ยื่นเสนองานให้วงดนตรี";
                        const name = `ผู้ใช้ ${req.decoded.user_name}`;
                        const email = req.decoded.user_email;
                        const message =
                          "ต้องการจะติดต่อเสนองานให้คุณถ้าสนใจโปรดตอบกลับอีเมลนี้";

                        const emailContent = htmlTemplate
                          .replace("${name}", name)
                          .replace("${email}", email)
                          .replace("${message}", message)
                          .replace("${Contact}", Contact);

                        const mailOptions = {
                          from: "scarlettz.mew@gmail.com",
                          to: personIdresults.user_email, // list of receivers
                          html: emailContent, // แทนที่ "html" ด้วย "emailContent"
                        };
                        // send mail with defined transport object
                        try {
                          transporter.sendMail({
                            ...mailOptions,
                            subject: `Tungwong Mobile Application🎵🎷🎸🎹🎙️`,
                          });
                        } catch (err) {
                          console.log(err);
                          return res.status(400).json({ message: err.message });
                        }
                        sendOfferband(
                          body,
                          createAt,
                          (err, sendOffebandResults) => {
                            if (err) {
                              console.log(err);
                              return;
                            } else {
                              return res.status(200).json({
                                success: 1,
                                message: "sendOfferband successfully",
                                results: sendOffebandResults,
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          }
        );
      }
    });
  },
  checksendemailtoUser: (req, res) => {
    const body = req.body;
    body.user_id = req.decoded.user_id;
    checkOfferuser(
      body.user_id,
      body.person_id,
      (err, chcksendemailResults) => {
        try {
          if (err) {
            return res.status(500).json({
              success: 0,
              message: "Database connection error",
            });
          } else if (chcksendemailResults) {
            return res.status(200).json({
              sendOffer: true,
            });
          } else {
            return res.status(200).json({
              sendOffer: false,
            });
          }
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  },
  checksendemailtoBand: (req, res) => {
    const body = req.body;
    body.user_id = req.decoded.user_id;
    checkOfferband(body.user_id, body.band_id, (err, chcksendemailResults) => {
      try {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        } else if (chcksendemailResults) {
          return res.status(200).json({
            sendOffer: true,
          });
        } else {
          return res.status(200).json({
            sendOffer: false,
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    });
  },
};

const {
  getAllFollowers,
  getAllFollowersuserid,
  getAllFollowerbandid,
  getAllFollowinguserid,
  getAllFollowingbandid,
  checkuserfollowband,
  userfollowBand,
  checkuserfollowuser,
  userfollowUser,
  checkbandfollowband,
  bandfollowBand,
  checkbandfollowuser,
  bandfollowUser,
  // unfollowers,
  userunfollowuser,
  userunfollowband,
  bandunfollowuser,
  bandunfollowband,
} = require("../service/follow");
const { getbandBybandId } = require("../service/band");
const { getUserByuserId } = require("../service/user");
const myDateModule = require("../util/date");
module.exports = {
  // ! Followers
  getAllFollowers: (req, res) => {
    getAllFollowers((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          error: err,
        });
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
            followers_uid: result.followers_uid,
          };

          if (result.person_id !== null) {
            const userDetails = await getUserByuserIdAsync(result.person_id);
            // คัดลอกคุณสมบัติทั้งหมดจาก userDetails แต่ไม่รวม user_password
            transformedResult.person_details = { ...userDetails };
            delete transformedResult.person_details.user_password;
          }
          if (result.band_id !== null) {
            const bandDetails = await getbandBybandIdAsync(result.band_id);
            transformedResult.band_details = bandDetails;
          }
          if (result.followersuser_id !== null) {
            const followersUserDetails = await getUserByuserIdAsync(
              result.followersuser_id
            );
            // คัดลอกคุณสมบัติทั้งหมดจาก followersUserDetails แต่ไม่รวม user_password
            transformedResult.followersuser_details = {
              ...followersUserDetails,
            };
            delete transformedResult.followersuser_details.user_password;
          }
          if (result.followersband_id !== null) {
            const followersBandDetails = await getbandBybandIdAsync(
              result.followersband_id
            );
            transformedResult.followersband_details = followersBandDetails;
          }
          transformedResult.followers_createAt = result.followers_createAt;
          return transformedResult;
        });

        // รวมผลลัพธ์ของ Promises ทั้งหมด
        Promise.all(transformedResultsPromises)
          .then((transformedResults) => {
            return res.status(200).json({
              followers: transformedResults,
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
          success: 1,
          followers: [],
        });
      }
    });
  },
  //  * band เป็นคนกดติดตาม
  addFollowersByband: (req, res) => {
    const body = req.body;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    // req.body.person_id = req.decoded.user_id;
    if (body.band_id != null) {
      getbandBybandId(body.band_id, (err, results) => {
        if (err) {
          console.log(err);
          return;
        } else if (!results) {
          return res.status(404).json({
            success: 0,
            message: "Record bands not Found",
          });
        }
      });
    } 
    try {
      if (body.followersuser_id == null && body.followersband_id == null) {
        return res.status(409).json({
          success: 0,
          message: "Please fill data in the following",
        });
      } else if (
        body.followersuser_id != null &&
        body.followersband_id != null
      ) {
        return res.status(409).json({
          success: 0,
        });
      } else {
        // ! แสดงว่า follow วง
        if (body.followersuser_id == null) {
          console.log("follow วง");
          // console.log(body);
          // ! check band_id ที่กำลังจะติดตามว่ามีใน Table bands ไหม
          getbandBybandId(body.followersband_id, (err, results) => {
            if (err) {
              console.log(err);
              return;
            } else if (!results) {
              return res.status(404).json({
                success: 0,
                message: "Record bands not Found",
              });
            } else {
              // ! check band_id เคยติดตามวงนี้แล้วหรือยัง
              checkbandfollowband(
                body.band_id,
                body.followersband_id,
                (err, checkbandfollowbandresult) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({
                      success: 0,
                      message: "Database connection error",
                    });
                  }
                  // ! ถ้า  checkbandfollowbandresult แสดงว่าใน Table ยังไม่มีการ follow
                  if (!checkbandfollowbandresult) {
                    // ! ให้ bandfollowBand ได้
                    bandfollowBand(
                      body,
                      createAt,
                      (err, bandfollowBandresults) => {
                        if (err) {
                          console.log(err);
                          return res.status(500).json({
                            success: 0,
                            message: "Database connection error",
                          });
                        } else {
                          return res.status(200).json({
                            success: 1,
                            data: "successfully",
                            result: bandfollowBandresults,
                          });
                        }
                      }
                    );
                  } else {
                    return res.status(409).json({
                      success: 0,
                      data: "You have already followed him.",
                    });
                  }
                }
              );
            }
          });
          // ! แสดงว่า follow ผู้ใช้
        } else if (body.followersband_id == null) {
          console.log("follow ผู้ใช้");
          // console.log(body);
          // ! check user ที่กำลังจะถูกติดตามว่ามีใน Table users ไหม
          getUserByuserId(body.followersuser_id, (err, results) => {
            if (err) {
              console.log(err);
              return;
            } else if (!results) {
              return res.status(404).json({
                success: 0,
                message: "Record users not Found",
              });
            } else {
              // ! check band เคยติดตาม user นี้แล้วหรือยัง
              checkbandfollowuser(
                body.band_id,
                body.followersuser_id,
                (err, checkbandfollowuserResult) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({
                      success: 0,
                      message: "Database connection error",
                    });
                  }
                  // ! ถ้า  checkbandfollowuserResult แสดงว่าใน Table ยังไม่มีการ follow
                  if (!checkbandfollowuserResult) {
                    // ! ให้ userfollowuser ได้
                    bandfollowUser(
                      body,
                      createAt,
                      (err, userfollowfollowresults) => {
                        if (err) {
                          console.log(err);
                          return res.status(500).json({
                            success: 0,
                            message: "Database connection error",
                          });
                        } else {
                          return res.status(200).json({
                            success: 1,
                            data: "successfully",
                            result: userfollowfollowresults,
                          });
                        }
                      }
                    );
                  } else {
                    return res.status(409).json({
                      success: 0,
                      data: "You have already followed him.",
                    });
                  }
                }
              );
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  //  * person เป็นคนกดติดตาม
  addFollowersByuser: (req, res) => {
    const body = req.body;
    body.person_id = req.decoded.user_id;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    // req.body.person_id = req.decoded.user_id;
    try {
      if (body.followersuser_id == null && body.followersband_id == null) {
        return res.status(409).json({
          success: 0,
          message: "Please fill data in the following",
        });
      } else if (
        body.followersuser_id != null &&
        body.followersband_id != null
      ) {
        return res.status(409).json({
          success: 0,
        });
      } else {
        // ! แสดงว่า follow วง
        if (body.followersuser_id == null) {
          console.log("body.followersuser_id == null");
          // console.log(body);
          // ! check band_id ที่กำลังจะติดตามว่ามีใน Table bands ไหม
          getbandBybandId(body.followersband_id, (err, results) => {
            if (err) {
              console.log(err);
              return;
            } else if (!results) {
              return res.status(404).json({
                success: 0,
                message: "Record bands not Found",
              });
            } else {
              // ! check user เคยติดตามวงนี้แล้วหรือยัง
              checkuserfollowband(
                body.person_id,
                body.followersband_id,
                (err, checkuserfollowbandresult) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({
                      success: 0,
                      message: "Database connection error",
                    });
                  }
                  // ! ถ้า  checkuserfollowbandresult แสดงว่าใน Table ยังไม่มีการ follow
                  if (!checkuserfollowbandresult) {
                    // ! ให้ userfollowBand ได้
                    userfollowBand(
                      body,
                      createAt,
                      (err, userfollowBandresults) => {
                        if (err) {
                          console.log(err);
                          return res.status(500).json({
                            success: 0,
                            message: "Database connection error",
                          });
                        } else {
                          return res.status(200).json({
                            success: 1,
                            data: "successfully",
                            result: userfollowBandresults,
                          });
                        }
                      }
                    );
                  } else {
                    return res.status(409).json({
                      success: 0,
                      data: "You have already followed him.",
                    });
                  }
                }
              );
            }
          });
          // ! แสดงว่า follow ผู้ใช้
        } else if (body.followersband_id == null) {
          console.log("body.followersband_id == null");
          // console.log(body);
          // ! check user ที่กำลังจะติดตามว่ามีใน Table users ไหม
          getUserByuserId(body.followersuser_id, (err, results) => {
            if (err) {
              console.log(err);
              return;
            } else if (!results) {
              return res.status(404).json({
                success: 0,
                message: "Record users not Found",
              });
            } else {
              // ! check user เคยติดตาม user นี้แล้วหรือยัง
              checkuserfollowuser(
                body.person_id,
                body.followersuser_id,
                (err, checkuserfollowuserresult) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({
                      success: 0,
                      message: "Database connection error",
                    });
                  }
                  // ! ถ้า  checkuserfollowuserresult แสดงว่าใน Table ยังไม่มีการ follow
                  if (!checkuserfollowuserresult) {
                    // ! ให้ userfollowuser ได้
                    userfollowUser(
                      body,
                      createAt,
                      (err, userfollowfollowresults) => {
                        if (err) {
                          console.log(err);
                          return res.status(500).json({
                            success: 0,
                            message: "Database connection error",
                          });
                        } else {
                          return res.status(200).json({
                            success: 1,
                            data: "successfully",
                            result: userfollowfollowresults,
                          });
                        }
                      }
                    );
                  } else {
                    return res.status(409).json({
                      success: 0,
                      data: "You have already followed him.",
                    });
                  }
                }
              );
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  // ! fetching followers ใครกำลังติดตามเรา
  getAllFollowersuserid: (req, res) => {
    const user_id = req.params.user_id;
    // const body = req.body;
    // body.user_id = req.decoded.user_id;
    // console.log(req.decoded.user_id);
    getAllFollowersuserid(user_id, async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      // console.log(results.length);
      if (results.length == 0) {
        return res.status(404).json({
          success: 0,
          message: "No one is following you yet.",
          followers: results,
          followers_length: results.length,
        });
      } else {
        try {
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

          // สร้าง promises สำหรับแต่ละผู้ติดตาม
          const followerPromises = results.map(async (result) => {
            const followerResult = {
              followers_uid: result.followers_uid,
            };
            if (result.person_id !== null) {
              const personDetails = await getUserByuserIdAsync(
                result.person_id
              );
              // คัดลอกคุณสมบัติทั้งหมดจาก personDetails แต่ไม่รวม user_password
              followerResult.person_details = { ...personDetails };
              delete followerResult.person_details.user_password;
            } else if (result.band_id !== null) {
              const bandDetails = await getbandBybandIdAsync(result.band_id);
              followerResult.band_details = bandDetails;
            }

            followerResult.followers_createAt = result.followers_createAt;
            return followerResult;
          });

          const followerDetails = await Promise.all(followerPromises);

          return res.status(200).json({
            followers: followerDetails,
            followers_length: followerDetails.length,
          });
        } catch (e) {
          console.log(e);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
      }
    });
  },
  // ! fetching followers ใครกำลังติดตามเรา
  getAllFollowerbandid: (req, res) => {
    const band_id = req.params.band_id;
    // const body = req.body;
    // body.user_id = req.decoded.user_id;
    // console.log(req.decoded.user_id);
    getAllFollowerbandid(band_id, async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      console.log(results.length);
      if (results.length == 0) {
        return res.status(404).json({
          success: 0,
          message: "No one is following you yet.",
          followers: results,
          followers_length: results.length,
        });
      } else {
        try {
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

          // สร้าง promises สำหรับแต่ละผู้ติดตาม
          const followerPromises = results.map(async (result) => {
            const followerResult = {
              followers_uid: result.followers_uid,
            };
            if (result.person_id !== null) {
              const personDetails = await getUserByuserIdAsync(
                result.person_id
              );
              // คัดลอกคุณสมบัติทั้งหมดจาก personDetails แต่ไม่รวม user_password
              followerResult.person_details = { ...personDetails };
              delete followerResult.person_details.user_password;
            } else if (result.band_id !== null) {
              const bandDetails = await getbandBybandIdAsync(result.band_id);
              followerResult.band_details = bandDetails;
            }

            followerResult.followers_createAt = result.followers_createAt;
            return followerResult;
          });

          const followerDetails = await Promise.all(followerPromises);

          return res.status(200).json({
            followers: followerDetails,
            followers_length: followerDetails.length,
          });
        } catch (e) {
          console.log(e);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
      }
    });
  },
  // ! fetching following เรากำลังติดตามใคร
  getAllFollowinguserid: (req, res) => {
    const user_id = req.params.user_id;
    getAllFollowinguserid(user_id, async (err, results) => {
      console.log(results);
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      console.log(results.length);
      if (results.length == 0) {
        return res.status(404).json({
          success: 0,
          message: "You aren't following anyone yet.",
          following: results,
          following_length: results.length,
        });
      } else {
        try {
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

          const followingPromises = results.map(async (result) => {
            const followingResult = {
              followers_uid: result.followers_uid,
            };

            if (result.followersband_id !== null) {
              const bandDetails = await getbandBybandIdAsync(
                result.followersband_id
              );
              followingResult.band_details = bandDetails;
            }

            if (result.followersuser_id !== null) {
              const personDetails = await getUserByuserIdAsync(
                result.followersuser_id
              );
              followingResult.person_details = {
                ...personDetails,
              };
              delete followingResult.person_details.user_password;
            }
            followingResult.followers_createAt = result.followers_createAt;
            return followingResult;
          });

          const followingDetails = await Promise.all(followingPromises);

          return res.status(200).json({
            following: followingDetails,
            following_length: followingDetails.length,
          });
        } catch (e) {
          console.log(e);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
      }
    });
  },
  // ! fetching following เรากำลังติดตามใคร (โดยใช้ band_id)
  getAllFollowingbandid: (req, res) => {
    const band_id = req.params.band_id;
    getAllFollowingbandid(band_id, async (err, results) => {
      console.log(results);
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      console.log(results.length);
      if (results.length == 0) {
        return res.status(404).json({
          success: 0,
          message: "No one is following this band yet.",
          following: results,
          following_length: results.length,
        });
      } else {
        try {
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

          const followingPromises = results.map(async (result) => {
            const followingResult = {
              followers_uid: result.followers_uid,
            };

            if (result.followersband_id !== null) {
              const bandDetails = await getbandBybandIdAsync(
                result.followersband_id
              );
              followingResult.band_details = bandDetails;
            }

            if (result.followersuser_id !== null) {
              const personDetails = await getUserByuserIdAsync(
                result.followersuser_id
              );
              followingResult.person_details = {
                ...personDetails,
              };
              delete followingResult.person_details.user_password;
            }

            followingResult.followers_createAt = result.followers_createAt;

            return followingResult;
          });

          const followingDetails = await Promise.all(followingPromises);

          return res.status(200).json({
            following: followingDetails,
            following_length: followingDetails.length,
          });
        } catch (e) {
          console.log(e);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
      }
    });
  },

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
  // ! checkuserfollowersuser
  checkuserfollowersuser: (req, res) => {
    const body = req.body;
    body.person_id = req.decoded.user_id;
    // console.log(req.decoded.user_id);
    if (body.person_id == body.user_id) {
      return res.status(409).json({
        success: 0,
        message: "You can't follow with yourself.",
      });
    } else {
      getUserByuserId(body.user_id, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        } else if (!results) {
          return res.status(404).json({
            success: 0,
            message: "user not Found",
          });
        } else {
          checkuserfollowuser(body.person_id, body.user_id, (err, results) => {
            try {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  success: 0,
                  message: "Database connection error",
                });
              }
              if (!results) {
                return res.status(200).json({
                  followers: false,
                });
              } else {
                return res.status(200).json({
                  followers: true,
                });
              }
            } catch (err) {
              console.log(err);
            }
          });
        }
      });
    }
  },
  // ! checkuserfollowersband
  checkuserfollowersband: (req, res) => {
    const body = req.body;
    body.person_id = req.decoded.user_id;
    // console.log(req.decoded.user_id);)
    getbandBybandId(body.band_id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      } else if (!results) {
        return res.status(404).json({
          success: 0,
          message: "band not Found",
        });
      } else {
        checkuserfollowband(body.person_id, body.band_id, (err, results) => {
          try {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: 0,
                message: "Database connection error",
              });
            }
            if (!results) {
              return res.status(200).json({
                followers: false,
              });
            } else {
              return res.status(200).json({
                followers: true,
              });
            }
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
  },
  // ! checkbandfollowersuser
  checkbandfollowersuser: (req, res) => {
    const body = req.body;
    checkbandfollowuser(body.band_id, body.user_id, (err, results) => {
      try {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
        if (!results) {
          return res.status(200).json({
            followers: false,
          });
        } else {
          return res.status(200).json({
            followers: true,
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  },
  // ! checkbandfollowersband
  checkbandfollowersband: (req, res) => {
    const body = req.body;
    if (body.band_id == body.followersband_id) {
      return res.status(409).json({
        success: 0,
        message: "You can't follow with yourself.",
      });
    }
    checkbandfollowband(body.band_id, body.followersband_id, (err, results) => {
      try {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
        if (!results) {
          return res.status(200).json({
            followers: false,
          });
        } else {
          return res.status(200).json({
            followers: true,
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  },
  // ! userunfollowersuser
  userunfollowersuser: (req, res) => {
    const body = req.body;
    body.person_id = req.decoded.user_id;
    userunfollowuser(body, (err, results) => {
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
          message: "unfollower acccept",
        });
      } catch (error) {
        console.log(err);
      }
    });
  },
  // ! userunfollowersband
  userunfollowersband: (req, res) => {
    const body = req.body;
    body.person_id = req.decoded.user_id;
    userunfollowband(body, (err, results) => {
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
          message: "unfollower acccept",
        });
      } catch (error) {
        console.log(err);
      }
    });
  },
  // ! bandunfollowersuser
  bandunfollowersuser: (req, res) => {
    const body = req.body;
    bandunfollowuser(body, (err, results) => {
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
          message: "unfollower acccept",
        });
      } catch (error) {
        console.log(err);
      }
    });
  },
  // ! bandunfollowersband
  bandunfollowersband: (req, res) => {
    const body = req.body;
    bandunfollowband(body, (err, results) => {
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
          message: "unfollower acccept",
        });
      } catch (error) {
        console.log(err);
      }
    });
  },
};

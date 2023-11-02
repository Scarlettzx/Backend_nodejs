const {
  createReportbyuser,
  createReportbyband,
  getAllreports,
  checkreportbyuser,
  checkreportbyband,
  deletereport,
  // editPost,
  // deletePost,
  // countComment,
} = require("../service/report");
const { getUserByuserId } = require("../service/user");
const { getbandBybandId } = require("../service/band");
const { hidepost } = require("../service/posttest");
const { getPostbypostid, countComment } = require("../service/posttest");
const myDateModule = require("../util/date");
module.exports = {
  // ! createReportbyuser
  createReportbyuser: (req, res) => {
    const body = req.body;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    req.body.user_id = req.decoded.user_id;
    console.log(req.decoded.user_id);
    checkreportbyuser(
      body.post_id,
      body.user_id,
      (err, checkreportbyuserResult) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
        if (checkreportbyuserResult) {
          console.log(err);
          return res.status(403).json({
            success: 0,
            message: "You have already reported this post.",
          });
        } else {
          createReportbyuser(body, createAt, updateAt, (err, reportResults) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: 0,
                message: "Database connection error",
              });
            }

            // Get user details by user_id
            getUserByuserId(body.user_id, (err, userResults) => {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  success: 0,
                  message: "Database connection error",
                });
              }

              if (!userResults) {
                return res.status(404).json({
                  success: 0,
                  message: "User not found",
                });
              }
              userResults.user_password = undefined;
              const reportWithUser = {
                reportResults,
                createReportBy: userResults, // Adding user details to the response
              };

              return res.status(200).json({
                success: 1,
                data: reportWithUser,
              });
            });
          });
        }
      }
    );
  },

  // ! createReportbyband
  createReportbyband: (req, res) => {
    const body = req.body;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    getbandBybandId(body.band_id, (err, bandResults) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      if (!bandResults) {
        return res.status(404).json({
          success: 0,
          message: "Band not found",
        });
      }
      checkreportbyband(
        body.post_id,
        body.band_od,
        (err, checkreportbybandResults) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection error",
            });
          }
          if (checkreportbybandResults) {
            return res.status(403).json({
              success: 0,
              message: "You have already reported this post.",
            });
          } else {
            createReportbyband(
              body,
              createAt,
              updateAt,
              (err, reportResults) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                  });
                }
                // Get band details by band_id
                getbandBybandId(body.band_id, (err, bandResults) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({
                      success: 0,
                      message: "Database connection error",
                    });
                  }
                  if (!bandResults) {
                    return res.status(404).json({
                      success: 0,
                      message: "Band not found",
                    });
                  }
                  const reportWithBand = {
                    reportResults,
                    createReportBy: bandResults, // Adding user details to the response
                  };
                  return res.status(200).json({
                    success: 1,
                    data: reportWithBand,
                  });
                });
              }
            );
          }
        }
      );
    });
  },
  // ! getAllreports
  // ! getAllreports
  getAllreports: (req, res) => {
    getAllreports(async (err, results) => {
      console.log(results);
      if (err) {
        console.log(err);
        return;
      }

      // ตรวจสอบว่า results เป็นอาร์เรย์และไม่ว่าง
      if (Array.isArray(results) && results.length > 0) {
        const postPromises = results.map(async (result) => {
          if (result.post_id != null) {
            return new Promise((resolve, reject) => {
              getPostbypostid(result.post_id, (error, postDetails) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(postDetails);
                }
              });
            });
          }
          return null;
        });
        const postDetailsArray = await Promise.all(postPromises);

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

        const getcountCommentAsync = (id) => {
          return new Promise((resolve, reject) => {
            countComment(id, (err, countcommentResult) => {
              if (err) {
                reject(err);
              } else {
                resolve(countcommentResult);
              }
            });
          });
        };

        const useridPromise = results.map(async (result) => {
          if (result.user_id !== null) {
            return getUserByuserIdAsync(result.user_id);
          }
          return null;
        });

        const bandidPromise = results.map(async (result) => {
          if (result.band_id !== null) {
            return getbandBybandIdAsync(result.band_id);
          }
          return null;
        });

        const transformedResultsPromises = postDetailsArray.map(
          async (postDetails, index) => {
            const transformedResult = {
              report_id: results[index].report_id,
              post_id: postDetails.post_id,
              post_message: postDetails.post_message,
              post_like: postDetails.post_like,
              post_createAt: postDetails.post_createAt,
              post_updateAt: postDetails.post_updateAt,
              post_isHide: postDetails.post_isHide,
            };

            if (postDetails.post_id != null) {
              const countcomment = await getcountCommentAsync(
                postDetails.post_id
              );
              transformedResult.count_comment = countcomment;
            }

            if (postDetails.user_id !== null) {
              const userDetails = await getUserByuserIdAsync(
                postDetails.user_id
              );
              transformedResult.person_details = { ...userDetails };
              delete transformedResult.person_details.user_password;
            } else if (postDetails.band_id !== null) {
              const bandDetails = await getbandBybandIdAsync(
                postDetails.band_id
              );
              transformedResult.band_details = bandDetails;
            }
            if (useridPromise[index] != null) {
              useridPromise[index].then((userDetails) => {
                transformedResult.createReportByuser = { ...userDetails };
                delete transformedResult.createReportByuser.user_password;
                // console.log(userDetails);
              });
            }

            if (bandidPromise[index] != null) {
              bandidPromise[index].then((bandDetails) => {
                transformedResult.createReportByband = bandDetails;
                // console.log(bandDetails);
              });
            }

            return transformedResult;
          }
        );

        Promise.all(transformedResultsPromises)
          .then((transformedResults) => {
            return res.status(200).json({
              reports: transformedResults,
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
          reports: [],
        });
      }
    });
  },
  hidepost: (req, res) => {
    const body = req.body;
    hidepost(body.post_id, (err, hidepostResults) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      } else {
        return res.status(200).json({
          success: 1,
          results: hidepostResults,
        });
      }
    });
  },
  //   editPost: (req, res) => {
  //     const body = req.body;
  //     const updateAt = myDateModule.getCurrentDateTimeFormatted();
  //     editPost(body, updateAt, (err, editpostbyuserResults) => {
  //       if (err) {
  //         return res.status(500).json({
  //           success: 0,
  //           message: "Database connection error",
  //         });
  //       }
  //       if (!editpostbyuserResults) {
  //         return res.json({
  //           success: 0,
  //           message: "Failed to Update post",
  //         });
  //       }
  //       return res.status(200).json({
  //         success: 1,
  //         data: "updated successfully",
  //         result: editpostbyuserResults,
  //       });
  //     });
  //   },
  deletereport: (req, res) => {
    const body = req.body;
    deletereport(body.report_id, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: "delete successfully",
      });
    });
  },
};

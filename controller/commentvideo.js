const {
  createCommentvideobyuser,
  createCommentvideobyband,
  getCommentbyvideoid,
  getAllComments,
} = require("../service/commentvideo");
const { getUserByuserId } = require("../service/user");
const { getbandBybandId } = require("../service/band");
const{getAllVideosbyvideoid} = require("../service/video")
const myDateModule = require("../util/date");
module.exports = {
  // ! createCommentpostbyuser
  createCommentvideobyuser: (req, res) => {
    const body = req.body;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    //   const updateAt = myDateModule.getCurrentDateTimeFormatted();
    body.user_id = req.decoded.user_id;
    console.log(req.decoded.user_id);
    getAllVideosbyvideoid(body.video_id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      } else if (!results) {
        return res.status(404).json({
          success: 0,
          message: "Video not found",
        });
      } else {
        createCommentvideobyuser(body, createAt, (err, commentResults) => {
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
            const fianlComment = {
              commentResults,
              createCommentBy: userResults, // Adding user details to the response
            };

            return res.status(200).json({
              success: 1,
              data: fianlComment,
            });
          });
        });
      }
    });
  },

  // ! createCommentpostbyband
  createCommentvideobyband: (req, res) => {
    const body = req.body;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    // const updateAt = myDateModule.getCurrentDateTimeFormatted();
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

      createCommentvideobyband(
        body,
        createAt,
        // updateAt,
        (err, commentResults) => {
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
            const fianlComment = {
              commentResults,
              createCommentBy: bandResults, // Adding user details to the response
            };
            return res.status(200).json({
              success: 1,
              data: fianlComment,
            });
          });
        }
      );
    });
  },
  // ! getComment
  getComment: (req, res) => {
    getAllComments((err, results) => {
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
            comment_id: result.comment_id,
            comment_message: result.comment_message,
            comment_like: result.comment_like,
            comment_createAt: result.comment_createAt,
            video_id: result.video_id,
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
          return transformedResult;
        });
        // รวมผลลัพธ์ของ Promises ทั้งหมด
        Promise.all(transformedResultsPromises)
          .then((transformedResults) => {
            return res.status(200).json({
              comments: transformedResults,
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
          comments: [],
        });
      }
    });
  },
  // ! getCommentbypostid
  getCommentbyvideoid: (req, res) => {
    const video_id = req.params.videoid;
    getCommentbyvideoid(video_id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results || results.length === 0) {
        console.log(req.params.videoid);
        return res.status(404).json({
          success: 0,
          message: "Record not Found",
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
            comment_id: result.comment_id,
            comment_message: result.comment_message,
            comment_like: result.comment_like,
            comment_createAt: result.comment_createAt,
            video_id: result.video_id,
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
          return transformedResult;
        });
        // รวมผลลัพธ์ของ Promises ทั้งหมด
        Promise.all(transformedResultsPromises)
          .then((transformedResults) => {
            return res.status(200).json({
              comments: transformedResults,
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
          comments: [],
        });
      }
    });
  },
};

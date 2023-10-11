const {
  creatPostbyuser,
  creatPostbyband,
  getPosts,
} = require("../service/posttest");
const { getUserByuserId } = require("../service/user");
const { getbandBybandId } = require("../service/band");
const myDateModule = require("../util/date");
module.exports = {
  // ! creatPostbyuser
  creatPostbyuser: (req, res) => {
    const body = req.body;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    req.body.user_id = req.decoded.user_id;
    console.log(req.decoded.user_id);
    creatPostbyuser(body, createAt, updateAt, (err, postResults) => {
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
        const postWithUser = {
          postResults,
          createPostBy: userResults, // Adding user details to the response
        };

        return res.status(200).json({
          success: 1,
          data: postWithUser,
        });
      });
    });
  },

  // ! creatPostbyband
  creatPostbyband: (req, res) => {
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

      creatPostbyband(body, createAt, updateAt, (err, postResults) => {
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
          const postWithBand = {
            postResults,
            createPostBy: bandResults, // Adding user details to the response
          };
          return res.status(200).json({
            success: 1,
            data: postWithBand,
          });
        });
      });
    });
  },
  // ! getPost
  getPosts: (req, res) => {
    getPosts((err, results) => {
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
            post_id: result.post_id,
            post_message: result.post_message,
            post_like: result.post_like,
            post_createAt: result.post_createAt,
            post_updateAt: result.post_updateAt,
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
              posts: transformedResults,
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
          posts: [],
        });
      }
    });
  },
};

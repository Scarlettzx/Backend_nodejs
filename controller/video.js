const fs = require("fs");
const {
  createvideoByuser,
  createvideoByband,
  getAllVideos,
  // getPosts,
} = require("../service/video");
const cloudinary = require("../config/cloudinary.js");
const myDateModule = require("../util/date");
const { getUserByuserId } = require("../service/user");
const { getbandBybandId } = require("../service/band");
module.exports = {
  createvideoByuser: async (req, res) => {
    console.log(req.file);
    const body = req.body;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    req.body.user_id = req.decoded.user_id;
    console.log(req.decoded.user_id);
    if (!req.file) {
      console.log(req.file);
      return res.status(400).json({
        success: 0,
        message: "Video upload is required",
      });
    } else {
      if (body.message == null) {
        fs.unlinkSync(req.file.path);
        return res.status(409).json({
          success: 0,
          message: "Please fill a message",
        });
      }
      // body.video = req.file.filename;
      const filename = req.file.filename;
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "video_user",
          resource_type: "video",
          public_id: `${filename}`,
        });
        body.video = result.secure_url;
      } catch (error) {
        console.log(error.message);
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Error Cloudinary" });
      }
      createvideoByuser(body, createAt, updateAt, (err, videoResults) => {
        try {
          if (err) {
            console.log(err);
            fs.unlinkSync(req.file.path);
            return res.status(500).json({
              success: 0,
              message: "Database connection error",
            });
          }
          // Get user details by user_id
          getUserByuserId(body.user_id, (err, userResults) => {
            if (err) {
              console.log(err);
              fs.unlinkSync(req.file.path);
              return res.status(500).json({
                success: 0,
                message: "Database connection error",
              });
            }

            if (!userResults) {
              fs.unlinkSync(req.file.path);
              return res.status(404).json({
                success: 0,
                message: "User not found",
              });
            }
            userResults.user_password = undefined;
            const videoWithuser = {
              videoResults,
              uploadVideoBy: userResults, // Adding user details to the response
            };

            return res.status(200).json({
              success: 1,
              data: videoWithuser,
            });
          });
        } catch (error) {
          console.log(error);
        }
      });
    }
  },
  createvideoByband: async (req, res) => {
    const body = req.body;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    if (!req.file) {
      console.log(req.file);
      return res.status(400).json({
        success: 0,
        message: "Video upload is required",
      });
    } else {
      if (body.message == null) {
        fs.unlinkSync(req.file.path);
        return res.status(409).json({
          success: 0,
          message: "Please fill a message",
        });
      }
      const filename = req.file.filename.split(".")[0];
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "vide_band",
          resource_type: "video",
          public_id: `${filename}`,
        });
        body.video = result.secure_url;
      } catch (error) {
        console.log(error.message);
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Error Cloudinary" });
      }
      getbandBybandId(body.band_id, (err, bandResults) => {
        if (err) {
          console.log(err);
          fs.unlinkSync(req.file.path);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
        if (!bandResults) {
          fs.unlinkSync(req.file.path);
          return res.status(404).json({
            success: 0,
            message: "Band not found",
          });
        }
        createvideoByband(body, createAt, updateAt, (err, videoResults) => {
          try {
            if (err) {
              console.log(err);
              fs.unlinkSync(req.file.path);
              return res.status(500).json({
                success: 0,
                message: "Database connection error",
              });
            }
            const videoWithuser = {
              videoResults,
              uploadVideoBy: bandResults, // Adding user details to the response
            };

            return res.status(200).json({
              success: 1,
              data: videoWithuser,
            });
          } catch (error) {
            console.log(error);
          }
        });
      });
    }
  },
  getAllVideos: (req, res) => {
    getAllVideos((err, results) => {
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
            video_id: result.video_id,
            video_message: result.video_message,
            video_filename: result.video_filename,
            video_like: result.video_like,
            video_createAt: result.video_createAt,
            video_updateAt: result.video_updateAt,
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
              videos: transformedResults,
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
          videos: [],
        });
      }
    });
  },
};

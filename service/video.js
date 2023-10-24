const pool = require("../config/db");
module.exports = {
  createvideoByuser: (data, createAt, updateAt, callBack) => {
    pool.query(
      `INSERT INTO videos(video_message, video_filename,band_id, user_id,video_createAt,video_updateAt) VALUES(?,?,?,?,?,?)`,
      [data.message, data.video, null, data.user_id, createAt, updateAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const videoResults = {
            video_id: results.insertId,
            video_message: data.message,
            video_filename: data.video,
            video_createAt: createAt,
            video_updateAt: updateAt,
          };
          callBack(null, videoResults); // ส่งค่า post_id กลับไปใน callBack
        }
      }
    );
  },
  createvideoByband: (data, createAt, updateAt, callBack) => {
    pool.query(
      `INSERT INTO videos(video_message, video_filename,band_id, user_id,video_createAt,video_updateAt) VALUES(?,?,?,?,?,?)`,
      [data.message, data.video, data.band_id, null, createAt, updateAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const videoResults = {
            video_id: results.insertId,
            video_message: data.message,
            video_filename: data.video,
            video_createAt: createAt,
            video_updateAt: updateAt,
          };
          callBack(null, videoResults); // ส่งค่า post_id กลับไปใน callBack
        }
      }
    );
  },
  getAllVideos: (callBack) => {
    pool.query(
      `SELECT *
      FROM videos`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getAllVideosbyvideoid: (video_id, callBack) => {
    pool.query(
      `SELECT *
      FROM videos WHERE video_id = ?`,
      [video_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
};

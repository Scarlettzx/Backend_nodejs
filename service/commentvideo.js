const pool = require("../config/db");

module.exports = {
    createCommentvideobyuser: (data, createAt, callBack) => {
    pool.query(
      "INSERT INTO commentsvideos (comment_message, comment_createAt,user_id,band_id, video_id) VALUES (?,?,?,?,?)",
      [data.message, createAt, data.user_id, null, data.video_id],
      (err, results, fields) => {
        if (err) {
          callBack(err);
        } else {
          const commentResults = {
            comment_id: results.insertId,
            comment_message: data.message,
            comment_createAt: createAt,
            video_id: data.video_id,
          };
          callBack(null, commentResults);
        }
      }
    );
  },
  createCommentvideobyband: (data, createAt, callBack) => {
    pool.query(
      "INSERT INTO commentsvideos (comment_message, comment_createAt,user_id,band_id, video_id) VALUES (?,?,?,?,?)",
      [data.message, createAt, null, data.band_id, data.video_id],
      (err, results, fields) => {
        if (err) {
          callBack(err);
        } else {
          const commentResults = {
            comment_id: results.insertId,
            comment_message: data.message,
            comment_createAt: createAt,
            video_id: data.video_id,
          };
          callBack(null, commentResults);
        }
      }
    );
  },
  getAllComments: (callBack) => {
    pool.query(`SELECT * FROM commentsvideos `, [], (err, results, fields) => {
      if (err) {
        callBack(err);
      }
      return callBack(null, results);
    });
  },
  getCommentbyvideoid: (video_id, callBack) => {
    pool.query(
      `SELECT * FROM commentsvideos
        WHERE video_id = ?`,
      [video_id],
      (err, results, fields) => {
        if (err) {
          callBack(err);
        }
        return callBack(null, results);
      }
    );
  },
};

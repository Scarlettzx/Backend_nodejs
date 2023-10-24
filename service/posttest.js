const pool = require("../config/db");
module.exports = {
  createPostbyuser: (data, createAt, updateAt, callBack) => {
    pool.query(
      `INSERT INTO poststest(post_message, post_createAt, post_updateAt, user_id, band_id) VALUES(?,?,?,?,?)`,
      [data.message, createAt, updateAt, data.user_id, null],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const postResults = {
            post_id: results.insertId,
            post_message: data.message,
            post_createAt: createAt,
            post_updateAt: updateAt,
          };
          callBack(null, postResults); // ส่งค่า post_id กลับไปใน callBack
        }
      }
    );
  },
  createPostbyband: (data, createAt, updateAt, callBack) => {
    pool.query(
      `INSERT INTO poststest(post_message, post_createAt, post_updateAt, user_id, band_id) VALUES(?,?,?,?,?)`,
      [data.message, createAt, updateAt, null, data.band_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const postResults = {
            post_id: results.insertId,
            post_message: data.message,
            post_createAt: createAt,
            post_updateAt: updateAt,
          };
          callBack(null, postResults); // ส่งค่า post_id กลับไปใน callBack
        }
      }
    );
  },
  getPosts: (callBack) => {
    pool.query(
      `SELECT *
      FROM poststest`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  editPost: (body, updateAt, callBack) => {
    pool.query(
      `UPDATE poststest SET post_message = ?, post_updateAt = ? WHERE post_id = ? `,
      [body.post_message, updateAt, body.post_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  deletePost:(post_id,callBack)=>{
    pool.query(
      "DELETE FROM poststest WHERE post_id = ?",
      [post_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    )
  }
};

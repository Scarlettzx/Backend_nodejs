const pool = require("../config/db");
module.exports = {
  creatPostbyuser: (data, createAt, updateAt, callBack) => {
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
  creatPostbyband: (data, createAt, updateAt, callBack) => {
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
};

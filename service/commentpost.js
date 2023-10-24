const pool = require("../config/db");

module.exports = {
  createCommentpostbyuser: (data, createAt, callBack) => {
    pool.query(
      "INSERT INTO commentsposts (comment_message, comment_createAt,user_id,band_id, post_id) VALUES (?,?,?,?,?)",
      [data.message, createAt, data.user_id, null, data.post_id],
      (err, results, fields) => {
        if (err) {
          callBack(err);
        } else {
          const commentResults = {
            comment_id: results.insertId,
            comment_message: data.message,
            comment_createAt: createAt,
            poset_id: data.post_id,
          };
          callBack(null, commentResults);
        }
      }
    );
  },
  createCommentpostbyband: (data, createAt, callBack) => {
    pool.query(
      "INSERT INTO commentsposts (comment_message, comment_createAt,user_id,band_id, post_id) VALUES (?,?,?,?,?)",
      [data.message, createAt, null, data.band_id, data.post_id],
      (err, results, fields) => {
        if (err) {
          callBack(err);
        } else {
          const commentResults = {
            comment_id: results.insertId,
            comment_message: data.message,
            comment_createAt: createAt,
            poset_id: data.post_id,
          };
          callBack(null, commentResults);
        }
      }
    );
  },
  getAllComments: (callBack) => {
    pool.query(`SELECT * FROM commentsposts `, [], (err, results, fields) => {
      if (err) {
        callBack(err);
      }
      return callBack(null, results);
    });
  },
  getCommentbypostid: (post_id, callBack) => {
    pool.query(
      `SELECT * FROM commentsposts
        WHERE post_id = ?`,
      [post_id],
      (err, results, fields) => {
        if (err) {
          callBack(err);
        }
        return callBack(null, results);
      }
    );
  },
};

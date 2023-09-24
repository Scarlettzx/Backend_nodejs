const pool = require("../config/db");

module.exports = {
  createComments: (data, createAt, updateAt, callBack) => {
    pool.query(
      "INSERT INTO comments (comment_message, comment_createAt,user_id, post_id) VALUES (?,?,?,?)",
      [data.message, createAt, data.user_id, data.post_id],
      (err, results, fields) => {
        if (err) {
          callBack(err);
        } else {
          const commentResults = {
            comment_id: results.insertId,
            comment_message: data.message,
            comment_createAt: createAt,
            // user_id: data.user_id,
            poset_id: data.post_id,
          };
          callBack(null, commentResults);
        }
      }
    );
  },
  getAllComments: (callBack) => {
    pool.query(
      `SELECT comments.comment_id, comments.comment_message, comments.comment_like, comments.comment_createAt,comments.post_id, users.*
      FROM comments
      INNER JOIN users ON comments.user_id = users.user_id`,
      [],
      (err, results, fields) => {
        if (err) {
          callBack(err);
        }
        return callBack(null, results);
      }
    );
  },
  getComment: (post_id, callBack) => {
    pool.query(
      `SELECT comments.comment_id, comments.comment_message, comments.comment_like, comments.comment_createAt,comments.post_id, users.*
        FROM comments 
        INNER JOIN users ON comments.user_id = users.user_id
        WHERE comments.post_id = ?`,
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

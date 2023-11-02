// const pool = require("../config/db");
// module.exports = {
//   createPosts: (data, createAt, updateAt, callBack) => {
//     pool.query(
//       `INSERT INTO posts(post_message, post_createAt, post_updateAt, user_id) VALUES(?,?,?,?)`,
//       [data.message, createAt, updateAt, data.user_id],
//       (error, results, fields) => {
//         if (error) {
//           callBack(error);
//         } else {
//           const postResults = {
//             post_id: results.insertId,
//             post_message: data.message,
//             post_createAt: createAt,
//             post_updateAt: updateAt,
//           };
//           callBack(null, postResults); // ส่งค่า post_id กลับไปใน callBack
//         }
//       }
//     );
//   },
//   getPosts: (callBack) => {
//     pool.query(
//       `SELECT posts.post_id, posts.post_message, posts.post_like, posts.post_createAt, posts.post_updateAt, users.*
//       FROM posts
//       INNER JOIN  users ON posts.user_id = users.user_id`,
//       [],
//       (error, results, fields) => {
//         if (error) {
//           callBack(error);
//         }
//         return callBack(null, results);
//       }
//     );
//   },
// };

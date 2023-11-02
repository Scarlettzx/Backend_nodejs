const pool = require("../config/db");
module.exports = {
  create: (data, createAt, updateAt, callBack) => {
    pool.query(
      `INSERT INTO users(user_name, user_email, user_password,user_country,user_position, user_avatar,user_createAt,user_updateAt) VALUES(?,?,?,?,?,?,?,?)`,
      [
        data.username,
        data.email,
        data.password,
        data.country,
        data.position,
        data.avatar,
        createAt,
        updateAt,
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  createadmin: (data, createAt, updateAt, callBack) => {
    pool.query(
      `INSERT INTO users(user_name, user_email, user_password,user_country,user_position, user_avatar , user_isAdmin ,user_createAt,user_updateAt) VALUES(?,?,?,?,?,?,?,?,?)`,
      [
        data.username,
        data.email,
        data.password,
        data.country,
        data.position,
        data.avatar,
        data.isadmin,
        createAt,
        updateAt,
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUsers: (callBack) => {
    pool.query(
      `SELECT user_id, user_name ,user_email, user_country, user_position, user_avatar, user_isAdmin, user_createAt, user_updateAt, band_id, band_Type FROM users`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUserByuserId: (id, callBack) => {
    pool.query(
      `SELECT * FROM users WHERE user_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUserByuserName: (name, callBack) => {
    pool.query(
      `SELECT  user_id, user_email, user_country, user_position, user_avatar, user_isAdmin, user_createAt, user_updateAt, band_id, band_Type FROM users WHERE user_name = ?`,
      [name],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updateUsertext: (data, updateAt, callBack) => {
    pool.query(
      `UPDATE users SET user_name = ?, user_country = ?, user_position = ?, user_updateAt = ? WHERE user_id = ? `,
      [data.username, data.country, data.position, updateAt, data.user_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  ChangePassword: (data, updateAt, callBack) => {
    pool.query(
      `UPDATE users SET user_password = ?, user_updateAt = ? WHERE user_id = ? `,
      [data.newpassword, updateAt, data.user_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updateUserAll: (data, updateAt, callBack) => {
    pool.query(
      `UPDATE users SET user_name = ?, user_country = ?,user_position = ?,user_avatar = ?, user_updateAt = ? WHERE user_id = ? `,
      [
        data.username,
        data.country,
        data.position,
        data.avatar,
        updateAt,
        data.user_id,
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  deleteUser: (data, callBack) => {
    pool.query(
      "DELETE FROM users WHERE user_id = ?",
      [data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUserByUserEmail: (email, callback) => {
    pool.query(
      "SELECT * FROM users WHERE user_email = ?",
      [email],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  //   // ! Followers
  //   // ! getAllFollowers
  //   getAllFollowers: (callBack) => {
  //     pool.query(
  //       `SELECT followers.follower_uid,
  //       followers.person_id,
  //       JSON_OBJECT(
  //           'user_id', users.user_id,
  //           'user_email', users.user_email,
  //           'user_name', users.user_name,
  //           'user_password', users.user_password,
  //           'user_country', users.user_country,
  //           'user_position', users.user_position,
  //           'user_avatar', users.user_avatar,
  //           'user_isAdmin', users.user_isAdmin,
  //           'user_createAt', users.user_createAt,
  //           'user_updateAt', users.user_updateAt,
  //           'band_id', users.band_id,
  //           'band_Type', users.band_Type
  //       ) as followers_id,
  //       followers.followers_createAt
  // FROM followers
  // INNER JOIN users ON followers.followers_id = users.user_id`,
  //       [],
  //       (error, results, fields) => {
  //         if (error) {
  //           callBack(error);
  //         }
  //         return callBack(null, results);
  //         // console.log(results, fields);
  //       }
  //     );
  //   },

  //   // ! AddFollowers
  //   addFollower: (data, createAt, callBack) => {
  //     pool.query(
  //       `INSERT INTO followers(person_id,followers_id,followers_createAt) VALUES(?,?,?)`,
  //       [data.person_id, data.followers_id, createAt],
  //       (error, results, fields) => {
  //         if (error) {
  //           callBack(error);
  //         } else {
  //           const followresults = {
  //             follower_uid: results.insertId,
  //             person_id: data.person_id,
  //             followers_id: data.followers_id,
  //             followers_createAt: createAt,
  //           };
  //           console.log(results);
  //           return callBack(null, followresults);
  //         }
  //       }
  //     );
  //   },
  //   checkFollower: (data, callBack) => {
  //     pool.query(
  //       "SELECT * FROM followers WHERE person_id = ? AND followers_id = ?",
  //       [data.person_id, data.followers_id],
  //       (error, results, fields) => {
  //         if (error) {
  //           callBack(error);
  //         }
  //         return callBack(null, results);
  //       }
  //     );
  //   },
  //   // ! getALlfollowersid
  //   getAllFollowersuserid: (user_id, callBack) => {
  //     pool.query(
  //       "SELECT * FROM followers WHERE followers_id = ?",
  //       [user_id],
  //       (error, results, fields) => {
  //         if (error) {
  //           callBack(error);
  //         }
  //         return callBack(null, results);
  //       }
  //     );
  //   },
  //   // ! getALlfollowingid
  //   getAllFollowinguserid: (user_id, callBack) => {
  //     pool.query(
  //       "SELECT * FROM followers WHERE person_id = ?",
  //       [user_id],
  //       (error, results, fields) => {
  //         if (error) {
  //           callBack(error);
  //         }
  //         return callBack(null, results);
  //       }
  //     );
  //   },
  //   unfollowers: (data, callBack) => {
  //     pool.query(
  //       "DELETE FROM followers WHERE person_id = ? AND followers_id = ?",
  //       [data.person_id, data.followers_id],
  //       (error, results, fields) => {
  //         if (error) {
  //           callBack(error);
  //         }
  //         return callBack(null, results[0]);
  //       }
  //     );
  //   },
};

const pool = require("../config/db");
module.exports = {
  // ! FetchData All bands in DB
  getAllBand: (callBack) => {
    pool.query(
      `SELECT bands.band_id, bands.band_name, bands.band_category, bands.band_avatar, bands.band_createAt, bands.band_updateAt, users.*
      FROM bands
      INNER JOIN users ON bands.band_id = users.band_id AND users.band_Type = 2`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  createBand: (data, createAt, updateAt, callBack) => {
    pool.query(
      "INSERT INTO bands(band_name, band_category, band_avatar, band_createAt, band_updateAt) VALUES(?,?,?,?,?)",
      [data.name, data.category, data.avatar, createAt, updateAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        const bandResults = {
          band_id: results.insertId,
          band_name: data.name,
          band_category: data.category,
          band_avatar: data.avatar,
          band_createAt: createAt,
          band_updateAt: updateAt,
        };
        callBack(null, bandResults);
      }
    );
  },
  updateFounderBandType: (user_id, band_id, updateAt, callBack) => {
    pool.query(
      "UPDATE users SET band_Type = ?, band_id = ?,  user_updateAt = ? WHERE user_id = ?",
      [2, band_id, updateAt, user_id], // เปลี่ยน band_Type เป็น 2
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          // ดึงข้อมูลผู้ใช้ที่ถูกอัปเดต
          pool.query(
            "SELECT * FROM users WHERE user_id = ?",
            [user_id],
            (userError, userResults) => {
              if (userError) {
                callBack(userError);
              } else {
                callBack(null, userResults[0]);
              }
            }
          );
        }
      }
    );
  },
  updateMemberBandType: (person_id, band_id, updateAt, callBack) => {
    pool.query(
      "UPDATE users SET band_Type = ?, band_id = ?, user_updateAt = ? WHERE user_id = ?",
      [1, band_id, updateAt, person_id], // เปลี่ยน band_Type เป็น 2
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          // ดึงข้อมูลผู้ใช้ที่ถูกอัปเดต
          pool.query(
            "SELECT * FROM users WHERE user_id = ?",
            [person_id],
            (userError, userResults) => {
              if (userError) {
                callBack(userError);
              } else {
                callBack(null, userResults[0]);
              }
            }
          );
        }
      }
    );
  },
  getbandBybandName: (name, callBack) => {
    pool.query(
      `SELECT * FROM bands WHERE band_name = ?`,
      [name],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        console.log(results);
        console.log(fields);
        return callBack(null, results[0]);
      }
    );
  },
  getbandBybandId: (id, callBack) => {
    pool.query(
      `SELECT * FROM bands WHERE band_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  checkMemberInBand: (band_id, callBack) => {
    pool.query(
      `SELECT * FROM users WHERE band_id = ?`,
      [band_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  // ! delete band_id in Table bands
  deleteBand: (band_id, callBack) => {
    pool.query(
      "DELETE FROM bands WHERE band_id = ?",
      [band_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        console.log(results);
        console.log(results[0]);
        console.log(fields);
        return callBack(null, results[0]);
      }
    );
  },
  // ! check Founder In Band อาจจะไม่ใช้ถ้าใช้ middleware auth
  checkFounderInBand: (user_id, callBack) => {
    pool.query(
      "SELECT * FROM users WHERE user_id = ? AND band_Type = 2",
      [user_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  // ! change Band_Type in Table users In Band
  deleteMemberInBand: (user_id, updateAt, callBack) => {
    pool.query(
      "UPDATE users SET band_Type = ?, band_id = ?, user_updateAt = ? WHERE user_id = ?",
      [0, null, updateAt, user_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          console.log("result: " + results);
          console.log("result[0]: " + results[0]);
          console.log("fields " + fields);
          // ดึงข้อมูลผู้ใช้ที่ถูกอัปเดต
          pool.query(
            "SELECT * FROM users WHERE user_id = ?",
            [user_id],
            (userError, userResults) => {
              if (userError) {
                callBack(userError);
              } else {
                callBack(null, userResults[0]);
              }
            }
          );
        }
      }
    );
  },
  // ! update data In Band
  editBand: (data, updateAt, callBack) => {
    pool.query(
      "UPDATE bands SET band_name = ? ,band_category = ?, band_updateAt = ? WHERE band_id = ?",
      [data.band_name, data.band_category, updateAt, data.band_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          // ดึงข้อมูลผู้ใช้ที่ถูกอัปเดต
          pool.query(
            "SELECT * FROM bands WHERE band_id = ?",
            [data.band_id],
            (error, bandResults) => {
              if (error) {
                callBack(error);
              } else {
                callBack(null, bandResults[0]);
              }
            }
          );
        }
      }
    );
  },
  // deletebandinFollower: (band_id, callBack) => {
  //   pool.query(
  //     "DELETE FROM followerstest WHERE band_id = ? AND followersband_id = ?",
  //     [band_id, band_id],
  //     (error, results, fields) => {
  //       if (error) {
  //         callBack(error);
  //       }
  //       return callBack(null, results[0]);
  //     }
  //   );
  // },
};

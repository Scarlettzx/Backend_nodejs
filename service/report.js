const pool = require("../config/db");
module.exports = {
  createReportbyuser: (data, createAt, updateAt, callBack) => {
    pool.query(
      `INSERT INTO reports(post_id, user_id, band_id,report_createAt,report_updateAt) VALUES(?,?,?,?,?)`,
      [data.post_id, data.user_id, null, createAt, updateAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const reportResult = {
            report_id: results.insertId,
            post_id: data.post_id,
            user_id: data.user_id,
            report_createAt: createAt,
            report_updateAt: updateAt,
          };
          callBack(null, reportResult); // ส่งค่า post_id กลับไปใน callBack
        }
      }
    );
  },
  createReportbyband: (data, createAt, updateAt, callBack) => {
    pool.query(
      `INSERT INTO reports(post_id, user_id, band_id,report_createAt,report_updateAt) VALUES(?,?,?,?,?)`,
      [data.post_id, null, data.band_id, createAt, updateAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const reportResult = {
            report_id: results.insertId,
            post_id: data.post_id,
            band_id: data.band_id,
            report_createAt: createAt,
            report_updateAt: updateAt,
          };
          callBack(null, reportResult); // ส่งค่า post_id กลับไปใน callBack
        }
      }
    );
  },

  getAllreports: (callBack) => {
    pool.query(
      `SELECT *
      FROM reports`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  checkreportbyuser: (post_id, user_id, callBack) => {
    pool.query(
      "SELECT * FROM reports WHERE post_id = ? AND user_id = ?",
      [post_id, user_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  checkreportbyband: (post_id, band_id, callBack) => {
    pool.query(
      "SELECT * FROM reports WHERE post_id = ? AND band_id = ?",
      [post_id, band_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  deletereport: (report_id, callBack) => {
    pool.query(
      "DELETE FROM reports WHERE report_id = ?",
      [report_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
};

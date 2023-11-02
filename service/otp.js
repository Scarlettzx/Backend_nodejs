const pool = require("../config/db");
module.exports = {
  createOtp: (email, verificationcode, createAt, expiresAt, callBack) => {
    pool.query(
      "INSERT INTO otps (email, verificationcode, createAt, expiresAt) VALUES (?, ?, ?, ?)",
      [email, verificationcode, createAt, expiresAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  //   Checkotp
  Checkotp: (email, verificationcode, callBack) => {
    pool.query(
      "SELECT * FROM otps WHERE email = ? AND verificationcode = ?",
      [email, verificationcode],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  Deleteotp: (email, verificationcode, callBack) => {
    pool.query(
      "DELETE  FROM otps WHERE email = ? AND verificationcode = ? ",
      [email, verificationcode],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  DeleteotpAll: (email, callBack) => {
    pool.query(
      "DELETE  FROM otps WHERE email = ? ",
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};

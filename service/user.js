const pool = require("../config/db");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      `INSERT INTO user(username, email, password) VALUES(?,?,?)`,
      [data.username, data.email, data.password],
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
      `SELECT id, username, email, password FROM user`,
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
      `SELECT id, username, email, password FROM user WHERE id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUserByuserName:(username, callBack) =>{
    pool.query(
      `SELECT id, username, email, password FROM user WHERE username = ?`,
      [username],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateUser: (data, callBack) => {
    pool.query(
      `UPDATE user SET username = ?, email = ?, password = ? WHERE id = ? `,
      [data.id, data.username, data.email, data.password],
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
      "DELETE FROM user WHERE id = ?",
      [data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return null, results[0];
      }
    );
  },
  getUserByUserEmail: (email, callback) => {
    pool.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
};

const pool = require("../config/db");
module.exports = {
  createRole: (data, callBack) => {
    pool.query(
      `INSERT INTO roles(roles_name) VALUES(?)`,
      [data.name],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getRole: (callBack) => {
    pool.query(`SELECT * FROM roles`, [], (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    });
  },
};

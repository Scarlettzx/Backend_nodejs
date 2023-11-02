const pool = require("../config/db");
module.exports = {
  checkInviteBandbyuser: (user_id, person_id, callBack) => {
    pool.query(
      "SELECT * FROM notifications WHERE user_id = ? AND person_id = ? AND noti_type = 2",
      [user_id, person_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  checkInviteBandbyband: (band_id, person_id, callBack) => {
    pool.query(
      "SELECT * FROM notifications WHERE band_id = ? AND person_id = ? AND noti_type = 2",
      [band_id, person_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  createNotiInvitetojoinbandByuser: (data, createAt, callBack) => {
    pool.query(
      "INSERT INTO notifications (user_id, band_id, person_id, banded_id, noti_message ,noti_type,noti_createAt) VALUES(?,?,?,?,?,?,?)",
      [data.user_id, null, data.person_id, null, data.message, 2, createAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const notiResults = {
            noti_id: results.insertId,
            user_id: data.user_id,
            person_id: data.person_id,
            noti_message: data.message,
            noti_type: 2,
            noti_createAt: createAt,
          };
          return callBack(null, notiResults);
        }
      }
    );
  },
  createNotiInvitetojoinbandByband: (data, createAt, callBack) => {
    pool.query(
      "INSERT INTO notifications (user_id, band_id, person_id, banded_id, noti_message ,noti_type,noti_createAt) VALUES(?,?,?,?,?,?,?)",
      [null, data.band_id, data.person_id, null, data.message, 2, createAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const notiResults = {
            noti_id: results.insertId,
            band_id: data.band_id,
            person_id: data.person_id,
            noti_message: data.message,
            noti_type: 2,
            noti_createAt: createAt,
          };
          return callBack(null, notiResults);
        }
      }
    );
  },
  // createNotiEmailByband: (data, createAt, callBack) => {
  //   pool.query("INSERT INTO notifications () VALUES()", []);
  // },
  // createNotiEmailByuser: (data, createAt, callBack) => {
  //   pool.query("INSERT INTO notifications () VALUES()", []);
  // },
  //   ! deleteNotiInvitetojoinbandByband
  deleteNotiInvitetojoinbandByband: (band_id, person_id, callBack) => {
    pool.query(
      "DELETE FROM notifications WHERE band_id = ? AND person_id = ? AND noti_type = 2",
      [band_id, person_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  //   ! deleteNotiInvitetojoinbandByuser
  deleteNotiInvitetojoinbandByuser: (user_id, person_id, callBack) => {
    pool.query(
      "DELETE FROM notifications WHERE user_id = ? AND person_id = ? AND noti_type = 2",
      [user_id, person_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  //   ! deleteNotibydeleteBand
  deleteNotibydeleteBand: (user_id, callBack) => {
    pool.query(
      "DELETE FROM notifications WHERE user_id = ? AND noti_type = 2",
      [user_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getNotificationbyuserid: (person_id, callBack) => {
    pool.query(
      "SELECT * FROM notifications WHERE person_id = ?",
      [person_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getNotificationbybandedid: (band_id, callBack) => {
    pool.query(
      "SELECT * FROM notifications WHERE banded_id = ?",
      [band_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getNotificationfordeletebandbyuser: (user_id, callBack) => {
    pool.query(
      "SELECT * FROM notifications WHERE user_id = ? AND noti_type = 2",
      [user_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  checkOfferuser: (user_id, person_id, callBack) => {
    pool.query(
      "SELECT * FROM notifications WHERE user_id = ? AND person_id = ? AND noti_type = 1",
      [user_id, person_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  checkOfferband: (user_id, band_id, callBack) => {
    pool.query(
      "SELECT * FROM notifications WHERE user_id = ? AND banded_id = ? AND noti_type = 1",
      [user_id, band_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  sendOfferuser: (data, createAt, callBack) => {
    pool.query(
      "INSERT INTO notifications (user_id, band_id, person_id, banded_id, noti_message ,noti_type,noti_createAt) VALUES(?,?,?,?,?,?,?)",
      [data.user_id, null, data.person_id, null, data.message, 1, createAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const notiResults = {
            noti_id: results.insertId,
            user_id: data.user_id,
            person_id: data.person_id,
            noti_message: data.message,
            noti_type: 1,
            noti_createAt: createAt,
          };
          return callBack(null, notiResults);
        }
      }
    );
  },
  sendOfferband: (data, createAt, callBack) => {
    pool.query(
      "INSERT INTO notifications (user_id, band_id, person_id, banded_id, noti_message,noti_type,noti_createAt) VALUES(?,?,?,?,?,?,?)",
      [data.user_id, null, null, data.band_id, data.message, 1, createAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const notiResults = {
            noti_id: results.insertId,
            user_id: data.user_id,
            band_id: data.band_id,
            noti_message: data.message,
            noti_type: 1,
            noti_createAt: createAt,
          };
          return callBack(null, notiResults);
        }
      }
    );
  },
};

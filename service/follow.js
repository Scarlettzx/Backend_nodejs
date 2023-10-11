const pool = require("../config/db");
module.exports = {
  // ! Followers
  //   // ! getAllFollowers
  getAllFollowers: (callBack) => {
    pool.query(`SELECT * FROM followerstest`, [], (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
      // console.log(results, fields);
    });
  },

  //  * USER
  // ? ========================================================
  // ! checkuserfollowband before userfollowBand
  checkuserfollowband: (person_id, band_id, callBack) => {
    pool.query(
      "SELECT * FROM followerstest WHERE person_id = ? AND followersband_id = ?",
      [person_id, band_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  //  ? ========================================================
  // ! userfollowBand
  userfollowBand: (data, createAt, callBack) => {
    pool.query(
      `INSERT INTO followerstest(
        person_id, 
        band_id, 
        followersuser_id, 
        followersband_id, 
        followers_createAt 
        ) VALUES(?,?,?,?,?)`,
      [data.person_id, null, null, data.followersband_id, createAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const followresults = {
            followers_uid: results.insertId,
            person_id: data.person_id,
            followersband_id: data.followersband_id,
            followers_createAt: createAt,
          };
          console.log(results);
          return callBack(null, followresults);
        }
      }
    );
  },
  //  ? ========================================================
  // ! checkuserfollowuser before userfollowser
  checkuserfollowuser: (person_id, user_id, callBack) => {
    pool.query(
      "SELECT * FROM followerstest WHERE person_id = ? AND followersuser_id = ?",
      [person_id, user_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  //  ? ========================================================
  // ! userfollowUser
  userfollowUser: (data, createAt, callBack) => {
    pool.query(
      `INSERT INTO followerstest(
        person_id, 
        band_id, 
        followersuser_id, 
        followersband_id, 
        followers_createAt 
        ) VALUES(?,?,?,?,?)`,
      [data.person_id, null, data.followersuser_id, null, createAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const followresults = {
            followers_uid: results.insertId,
            person_id: data.person_id,
            followersuser_id: data.followersuser_id,
            followers_createAt: createAt,
          };
          console.log(results);
          return callBack(null, followresults);
        }
      }
    );
  },
  //  ? ========================================================

  // * BAND
  // ? ========================================================
  // ! checkbandfollowband before userfollowBand
  checkbandfollowband: (band_id, followersband_id, callBack) => {
    pool.query(
      "SELECT * FROM followerstest WHERE band_id = ? AND followersband_id = ?",
      [band_id, followersband_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  //  ? ========================================================
  // ! bandfollowBand
  bandfollowBand: (data, createAt, callBack) => {
    pool.query(
      `INSERT INTO followerstest(
        person_id, 
        band_id, 
        followersuser_id, 
        followersband_id, 
        followers_createAt 
        ) VALUES(?,?,?,?,?)`,
      [null, data.band_id, null, data.followersband_id, createAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const followresults = {
            followers_uid: results.insertId,
            band_id: data.band_id,
            followersband_id: data.followersband_id,
            followers_createAt: createAt,
          };
          console.log(results);
          return callBack(null, followresults);
        }
      }
    );
  },
  //  ? ========================================================
  // ! checkbandfollowuser before bandfollowser
  checkbandfollowuser: (band_id, user_id, callBack) => {
    pool.query(
      "SELECT * FROM followerstest WHERE band_id = ? AND followersuser_id = ?",
      [band_id, user_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  //  ? ========================================================
  // ! bandfollowUser
  bandfollowUser: (data, createAt, callBack) => {
    pool.query(
      `INSERT INTO followerstest(
        person_id, 
        band_id, 
        followersuser_id, 
        followersband_id, 
        followers_createAt 
        ) VALUES(?,?,?,?,?)`,
      [null, data.band_id, data.followersuser_id, null, createAt],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          const followresults = {
            followers_uid: results.insertId,
            band_id: data.band_id,
            followersuser_id: data.followersuser_id,
            followers_createAt: createAt,
          };
          console.log(results);
          return callBack(null, followresults);
        }
      }
    );
  },
  //  ? ========================================================

  // ! getAllFollowersuserid
  getAllFollowersuserid: (user_id, callBack) => {
    pool.query(
      "SELECT followers_uid, person_id, band_id, followers_createAt FROM followerstest WHERE followersuser_id = ?",
      [user_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  // ! getAllFollowerbandid
  getAllFollowerbandid: (band_id, callBack) => {
    pool.query(
      "SELECT followers_uid, person_id, band_id, followers_createAt FROM followerstest WHERE followersband_id = ?",
      [band_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  // ! getAllFollowinguserid
  getAllFollowinguserid: (user_id, callBack) => {
    pool.query(
      "SELECT followers_uid , followersuser_id, followersband_id, followers_createAt FROM followerstest WHERE person_id = ?",
      [user_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  // ! getAllFollowinguserid
  getAllFollowingbandid: (band_id, callBack) => {
    pool.query(
      "SELECT followers_uid, band_id, followersuser_id, followersband_id, followers_createAt FROM followerstest WHERE band_id = ?",
      [band_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  // ! userunfollowuser
  userunfollowuser: (data, callBack) => {
    pool.query(
      "DELETE FROM followerstest WHERE person_id = ? AND followersuser_id = ?",
      [data.person_id, data.followersuser_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  // ! userunfollowband
  userunfollowband: (data, callBack) => {
    pool.query(
      "DELETE FROM followerstest WHERE person_id = ? AND followersband_id = ?",
      [data.person_id, data.followersband_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  // ! bandunfollowuser
  bandunfollowuser: (data, callBack) => {
    pool.query(
      "DELETE FROM followerstest WHERE band_id = ? AND followersuser_id = ?",
      [data.band_id, data.followersuser_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  // ! bandunfollowband
  bandunfollowband: (data, callBack) => {
    pool.query(
      "DELETE FROM followerstest WHERE band_id = ? AND followersband_id = ?",
      [data.band_id, data.followersband_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
};

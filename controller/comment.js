const {
  createComments,
  getAllComments,
  getComment,
} = require("../service/comment");
const { getUserByuserId } = require("../service/user");
const myDateModule = require("../util/date");
module.exports = {
  createComment: (req, res) => {
    const body = req.body;
    const createAt = myDateModule.getCurrentDateTimeFormatted();
    const updateAt = myDateModule.getCurrentDateTimeFormatted();
    req.body.user_id = req.decoded.user_id;
    console.log(req.decoded.user_id);
    if (body.message == '') {
      return res.status(404).json({
        success: 0,
        message: "Message not found",
      });
    }
    getUserByuserId(body.user_id, (err, userResults) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      if (!userResults) {
        return res.status(404).json({
          success: 0,
          message: "User not found",
        });
      }
      createComments(body, createAt, updateAt, (err, commentResults) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
        userResults.user_password = undefined;
        const fianlComment = {
          commentResults,
          createCommentBy: userResults,
        };
        return res.status(200).json({
          succes: 1,
          data: fianlComment,
        });
      });
    });
  },
  getAllComment: (req, res) => {
    getAllComments((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      const sanitizedResults = results.map((result) => {
        const { user_password, ...sanitizedResult } = result;
        return sanitizedResult;
      });
      const finalresults = sanitizedResults.map((sanitizedResult) => {
        const {
          user_id,
          user_email,
          user_name,
          user_createAt,
          user_updateAt,
          user_country,
          user_position,
          user_avatar,
          user_isAdmin,
          band_id,
          band_Type,
          ...sanitizedUser
        } = sanitizedResult;
        const createByid = {
          user_id: user_id,
          user_email: user_email,
          user_name: user_name,
          user_country: user_country,
          user_position: user_position,
          user_avatar: user_avatar,
          user_isAdmin: user_isAdmin,
          user_createAt: user_createAt,
          user_updateAt: user_updateAt,
          band_id: band_id,
          band_Type: band_Type,
        };

        return {
          ...sanitizedUser,
          createByid,
        };
      });
      return res.status(200).json({
        comments: finalresults,
      });
    });
  },
  getComment: (req, res) => {
    const post_id = req.params.postid;
    getComment(post_id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results || results.length === 0) {
        return res.status(404).json({
          success: 0,
          message: "Record not Found",
        });
      }
      // ! เอา password ออก
      const sanitizedResults = results.map((result) => {
        const { user_password, ...sanitizedResult } = result;
        return sanitizedResult;
      });
      const finalresults = sanitizedResults.map((sanitizedResult) => {
        const {
          user_id,
          user_email,
          user_name,
          user_createAt,
          user_updateAt,
          user_country,
          user_position,
          user_avatar,
          user_isAdmin,
          band_id,
          band_Type,
          ...sanitizedUser
        } = sanitizedResult;
        const createByid = {
          user_id: user_id,
          user_email: user_email,
          user_name: user_name,
          user_country: user_country,
          user_position: user_position,
          user_avatar: user_avatar,
          user_isAdmin: user_isAdmin,
          user_createAt: user_createAt,
          user_updateAt: user_updateAt,
          band_id: band_id,
          band_Type: band_Type,
        };

        return {
          ...sanitizedUser,
          createByid,
        };
      });
      return res.status(200).json({
        comments: finalresults,
      });
    });
  },
};

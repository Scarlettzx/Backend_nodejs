// const { createPosts, getPosts } = require("../service/post");
// const { getUserByuserId } = require("../service/user");
// const myDateModule = require("../util/date");

// module.exports = {
//   // ! createPost
//   createPost: (req, res) => {
//     const body = req.body;
//     const createAt = myDateModule.getCurrentDateTimeFormatted();
//     const updateAt = myDateModule.getCurrentDateTimeFormatted();
//     req.body.user_id = req.decoded.user_id;
//     console.log(req.decoded.user_id);
//     createPosts(body, createAt, updateAt, (err, postResults) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({
//           success: 0,
//           message: "Database connection error",
//         });
//       }

//       // Get user details by user_id
//       getUserByuserId(body.user_id, (err, userResults) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json({
//             success: 0,
//             message: "Database connection error",
//           });
//         }

//         if (!userResults) {
//           return res.status(404).json({
//             success: 0,
//             message: "User not found",
//           });
//         }
//         userResults.user_password = undefined;
//         const postWithUser = {
//           postResults,
//           createPostBy: userResults, // Adding user details to the response
//         };

//         return res.status(200).json({
//           success: 1,
//           data: postWithUser,
//         });
//       });
//     });
//   },

//   // ! getPost
//   getPosts: (req, res) => {
//     getPosts((err, results) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       // Remove the "password" field from each object in the results array
//       const sanitizedResults = results.map((result) => {
//         const { user_password, ...sanitizedResult } = result;
//         return sanitizedResult;
//       });

//       const finalresults = sanitizedResults.map((sanitizedResult) => {
//         const {
//           user_id,
//           user_email,
//           user_name,
//           user_createAt,
//           user_updateAt,
//           user_country,
//           user_position,
//           user_avatar,
//           user_isAdmin,
//           band_id,
//           band_Type,
//           ...sanitizedUser
//         } = sanitizedResult;

//         const createByid = {
//           user_id: user_id,
//           user_email: user_email,
//           user_name: user_name,
//           user_country: user_country,
//           user_position: user_position,
//           user_avatar: user_avatar,
//           user_isAdmin: user_isAdmin,
//           user_createAt: user_createAt,
//           user_updateAt: user_updateAt,
//           band_id: band_id,
//           band_Type: band_Type,
//         };

//         return {
//           ...sanitizedUser,
//           createByid,
//         };
//       });
//       return res.status(200).json({
//         posts: finalresults,
//       });
//     });
//   },
// };

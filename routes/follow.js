// const { checkToken } = require("../auth/token_validation");
const { checkToken } = require("../auth/token_validation");
const {
  getAllFollowers,
  addFollowersByuser,
  addFollowersByband,
  getAllFollowersuserid,
  getAllFollowerbandid,
  getAllFollowinguserid,
  getAllFollowingbandid,
  checkuserfollowersuser,
  checkuserfollowersband,
  checkbandfollowersuser,
  checkbandfollowersband,
  userunfollowersuser,
  userunfollowersband,
  bandunfollowersuser,
  bandunfollowersband,
  // unfollowers,
  // checkFollowerprofile,
} = require("../controller/follow");
const router = require("express").Router();
// const { checkToken } = require("../auth/token_validation");

// ! Followers
// ! GETALL FOLLOWERS
router.get("/getallfollowers", getAllFollowers);
// //   GET FOLLOWER  (FOCUS FOLLOWERS_ID)(FECTCH PERSON_ID)
// router.get("/getallfollower/:user_id", getAllFollowersuserid);
// //   GET FOLLOWING (FOCUS PERSON_ID)(FETCH FOLLOWERS_ID)
// router.get("/getallfollowing/:user_id", getAllFollowinguserid);
// //   GET FOLLOWER  (FOCUS FOLLOWERS_ID)(FECTCH PERSON_ID)
// router.get("/getallfollower/:band_id", getAllFollowersbandid);
// //   GET FOLLOWING (FOCUS PERSON_ID)(FETCH FOLLOWERS_ID)
// router.get("/getallfollowing/:band_id", getAllFollowingbandid);
// ! getallfollowerByuserid
router.get("/getallfollowerByuserid/:user_id", getAllFollowersuserid);
router.get("/getallfollowerBybandid/:band_id", getAllFollowerbandid);
router.get("/getallfollowingByuserid/:user_id", getAllFollowinguserid);
router.get("/getallfollowingBybandid/:band_id", getAllFollowingbandid);
//  ! POST FOLLOWERS
router.post("/addfollowersbyuser", checkToken, addFollowersByuser);
router.post("/addfollowersbyband", checkToken, addFollowersByband);
// ! Check FOLLOWERS BEFORE ADDFOLLOWERs FOR USER
router.post("/checkuserfollowers/user", checkToken, checkuserfollowersuser);
router.post("/checkuserfollowers/band", checkToken, checkuserfollowersband);
// ! Check FOLLOWERS BEFORE ADDFOLLOWERs FOR BAND
router.post("/checkbandfollowers/user", checkToken, checkbandfollowersuser);
router.post("/checkbandfollowers/band", checkToken, checkbandfollowersband);
// ! DELETE  USER UNFLLOWERS USER
router.delete("/userunfollowers/user", checkToken, userunfollowersuser);
// ! DELETE  USER UNFLLOWERS BAND
router.delete("/userunfollowers/band", checkToken, userunfollowersband);
// ! DELETE  BAND UNFLLOWERS USER
router.delete("/bandunfollowers/user", checkToken, bandunfollowersuser);
// ! DELETE  BAND UNFLLOWERS BAND
router.delete("/bandunfollowers/band", checkToken, bandunfollowersband);
module.exports = router;

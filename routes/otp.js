const {
    createOtp,
  } = require("../controller/otp");
const router = require("express").Router();
router.post("/create", createOtp);
// router.get("/getVideosByuserid/:userid", getVideosbyUserid);
// router.get("/getVideosBybandid/:bandid", getVideosbyBandid);
// router.patch("/editvideo", checkToken, editVideo);
module.exports = router;
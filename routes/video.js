// const fs = require("fs");

// const resizeVideo = require("../middleware/FFMPEGvideo");
const {
  videoBandUpload,
  videoUserUpload,
  asyncWrapper,
} = require("../middleware/upload");
const {
  createvideoByuser,
  createvideoByband,
  getAllVideos,
  getVideosbyUserid,
  getVideosbyBandid,
  editVideo,
  deleteVideo,
} = require("../controller/video");
const { checkToken } = require("../auth/token_validation");
const router = require("express").Router();
router.post(
  "/createvideobyuser",
  checkToken,
  videoUserUpload.single("video"),

  createvideoByuser
);
router.post(
  "/createvideobyband",
  checkToken,
  videoBandUpload.single("video"),
  createvideoByband
);
router.get("/", checkToken, getAllVideos);
router.get("/getVideosByuserid/:userid", checkToken, getVideosbyUserid);
router.get("/getVideosBybandid/:bandid", checkToken, getVideosbyBandid);
router.patch("/editvideo", checkToken, editVideo);
router.delete("/deletevideo", checkToken, deleteVideo);
// // ! get comment condition params postid
// router.get("/:postid", checkToken, getCommentbypostid);
module.exports = router;

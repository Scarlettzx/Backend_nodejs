// const fs = require("fs");
const { checkToken } = require("../auth/token_validation");
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
} = require("../controller/video");
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
// // ! get comment condition params postid
// router.get("/:postid", checkToken, getCommentbypostid);
module.exports = router;

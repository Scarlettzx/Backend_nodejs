const {
    createCommentvideobyuser,
    createCommentvideobyband,
    getComment,
    getCommentbyvideoid,
  } = require("../controller/commentvideo.js");
  const { checkToken } = require("../auth/token_validation.js");
  const router = require("express").Router();
  
  router.get("/", checkToken, getComment);
  // ! get comment condition params postid
  router.get("/:videoid", checkToken, getCommentbyvideoid);
  router.post("/createcommentbyuser", checkToken, createCommentvideobyuser);
  router.post("/createcommentbyband", checkToken, createCommentvideobyband);
  module.exports = router;
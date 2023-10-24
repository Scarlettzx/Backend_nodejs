const {
  createPostbyuser,
  createPostbyband,
  getPosts,
  editPost,
  deletePost,
  // editPostbyband,
} = require("../controller/posttest.js");
const { checkToken } = require("../auth/token_validation");
const router = require("express").Router();

router.get("/", checkToken, getPosts);
router.post("/creatpostbyuser", checkToken, createPostbyuser);
router.post("/creatpostbyband", checkToken, createPostbyband);
router.patch("/editpost", checkToken, editPost);
router.delete("/deletepost", checkToken, deletePost);
// router.patch("/editpostbyband", checkToken, editPostbyband);
module.exports = router;

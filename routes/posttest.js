const {
  createPostbyuser,
  createPostbyband,
  getPosts,
} = require("../controller/posttest.js");
const { checkToken } = require("../auth/token_validation");
const router = require("express").Router();

router.get("/", checkToken, getPosts);
router.post("/creatpostbyuser", checkToken, createPostbyuser);
router.post("/creatpostbyband", checkToken, createPostbyband);
module.exports = router;

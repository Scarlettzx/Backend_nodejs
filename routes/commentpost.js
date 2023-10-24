const {
  createCommentpostbyuser,
  createCommentpostbyband,
  getComment,
  getCommentbypostid,
} = require("../controller/commentpost.js");
const { checkToken } = require("../auth/token_validation.js");
const router = require("express").Router();

router.get("/", checkToken, getComment);
// ! get comment condition params postid
router.get("/:postid", checkToken, getCommentbypostid);
router.post("/createcommentbyuser", checkToken, createCommentpostbyuser);
router.post("/createcommentbyband", checkToken, createCommentpostbyband);

module.exports = router;

const {
  createComment,
  getAllComment,
  getComment,
} = require("../controller/comment");
const { checkToken } = require("../auth/token_validation");
const router = require("express").Router();

router.post("/", checkToken, createComment);
router.get("/", checkToken, getAllComment);
// ! get comment condition params postid
router.get("/:postid", checkToken, getComment);
module.exports = router;

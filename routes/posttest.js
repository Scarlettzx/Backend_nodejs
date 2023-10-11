const {
  creatPostbyuser,
  creatPostbyband,
  getPosts,
} = require("../controller/posttest.js");
const { checkToken } = require("../auth/token_validation");
const router = require("express").Router();

router.get("/", checkToken, getPosts);
router.post("/creatpostbyuser", checkToken, creatPostbyuser);
router.post("/creatpostbyband", checkToken, creatPostbyband);
module.exports = router;

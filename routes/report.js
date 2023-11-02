const {
  createReportbyuser,
  createReportbyband,
  getAllreports,
  deletereport,
  hidepost,
  // getCommentbypostid,
} = require("../controller/report.js");
const { checkToken } = require("../auth/token_validation.js");
const router = require("express").Router();

router.get("/", checkToken, getAllreports);
//   // ! get comment condition params postid
// //   router.get("/:postid", checkToken, getCommentbypostid);
router.post("/createreportbyuser", checkToken, createReportbyuser);
router.post("/createreportbyband", checkToken, createReportbyband);
router.delete("/deletereport", checkToken, deletereport);
router.patch("/hidepost", checkToken, hidepost);

module.exports = router;

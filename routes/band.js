const {
  createBand,
  getAllBands,
  getbandBybandName,
  getbandBybandId,
  invtetoJoinBandbyuser,
  invtetoJoinBandbyband,
  deleteBand,
  editBandByFounder,
  leaveBandByMemberuserid,
  checkMemberInBand,
  leaveBandByFounder,
} = require("../controller/band");
const { checkToken } = require("../auth/token_validation");
const fs = require("fs");
const { imageBandUpload, asyncWrapper } = require("../middleware/upload");
const { validateMIMEType } = require("validate-image-type");
const router = require("express").Router();

// ? FetchData All bands in DB
router.get("/getallband", getAllBands);
// ? FetchData  By Using Bandid
router.get("/getbybandid/:id", getbandBybandId);
router.get("/getbybandname/:name", getbandBybandName);
//  ? create Band
router.post(
  "/create",
  imageBandUpload.single("avatar"),
  asyncWrapper(async (req, res, next) => {
    try {
      if (!req.file) {
        console.log(req.file);
        // เราสามารถส่งข้อความแสดงข้อผิดพลาดไปยังไคลเอนต์ได้ที่นี่
        return res.status(400).json({
          success: 0,
          message: "Image upload is required",
        });
      }

      const validationResult = await validateMIMEType(req.file.path, {
        originalFilename: req.file.originalname,
        allowMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/svg+xml",
          "image/jpg",
        ],
      });

      if (!validationResult.ok) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Invalid image file type" });
      }
      next();
      console.log("upload is checked valid");
    } catch (error) {
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ message: "Internal server error" });
    }
  }),
  checkToken,
  createBand
);
router.post("/invitebyuser", checkToken, invtetoJoinBandbyuser);
router.post("/invitebyband", checkToken, invtetoJoinBandbyband);
router.delete("/delete", checkToken, deleteBand);
// router.delete("/deleteband", deleteBandId);
router.patch(
  "/editband",
  checkToken,
  imageBandUpload.single("avatar"),
  asyncWrapper(async (req, res, next) => {
    try {
      if (!req.file) {
        next();
      } else {
        const validationResult = await validateMIMEType(req.file.path, {
          originalFilename: req.file.originalname,
          allowMimeTypes: [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/jpg",
          ],
        });

        if (!validationResult.ok) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ message: "Invalid image file type" });
        }
        next();
        console.log("upload is checked valid");
      }
    } catch (error) {
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ message: "Internal server error" });
    }
  }),
  editBandByFounder
);
router.delete("/leavebandbymember", checkToken, leaveBandByMemberuserid);
router.delete("/leavebandbyfounder", checkToken, leaveBandByFounder);
router.get("/checkmemberinband/:bandid", checkMemberInBand);
module.exports = router;

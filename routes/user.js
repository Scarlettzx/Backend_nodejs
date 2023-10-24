const {
  createUser,
  deleteUser,
  getUserByuserId,
  getUsers,
  getUserByuserName,
  updateUsers,
  login,
  // getAllFollowers,
  // addFollowers,
  // getAllFollowersuserid,
  // getAllFollowinguserid,
  // unfollowers,
  // checkFollowerprofile,
} = require("../controller/user");
const router = require("express").Router();
const fs = require("fs");
const { checkToken } = require("../auth/token_validation");
const { imageUserUpload, asyncWrapper } = require("../middleware/upload");
const { validateMIMEType } = require("validate-image-type");
// ! register
router.post(
  "/register",
  imageUserUpload.single("avatar"),
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
  createUser
);
// ! REGISTER AND LOGIN
router.get("/getallusers", getUsers);
router.get("/getbyuserid/:id", getUserByuserId);
// router.get("/getsearchuser/:email", getUserByUserEmail);
router.get("/getsearchuser/:name", getUserByuserName);
router.patch(
  "/editprofile",
  checkToken,
  imageUserUpload.single("avatar"),
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
  updateUsers
);
router.delete("/", checkToken, deleteUser);
// router.post("/register", createUser);
router.post("/login", login);

// // ! Followers
// // ! GETALL FOLLOWERS
// router.get("/getallfollowers", getAllFollowers);
// //  ! GET FOLLOWER  (FOCUS FOLLOWERS_ID)(FECTCH PERSON_ID)
// router.get("/getallfollowerByuserid/:user_id", getAllFollowersuserid);
// //  ! GET FOLLOWING (FOCUS PERSON_ID)(FETCH FOLLOWERS_ID)
// router.get("/getallfollowingByuserid/:user_id", getAllFollowinguserid);
// //  ! POST FOLLOWERS
// router.post("/addfollowers", checkToken, addFollowers);
// // ! Check FOLLOWERS BEFORE ADDFOLLOWERs
// router.post("/checkfollowers", checkToken, checkFollowerprofile);
// // ! DELETE UNFLLOWERS
// router.delete("/unfollowers", checkToken, unfollowers);

module.exports = router;
